import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    business_idea = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, generating, completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="projects")
    blueprint = relationship("ProjectBlueprint", back_populates="project", uselist=False, cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="project", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="project", cascade="all, delete-orphan")


class ProjectBlueprint(Base):
    __tablename__ = "project_blueprints"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)
    overview = Column(Text, nullable=True)  # Markdown text
    competitors = Column(Text, nullable=True)  # Markdown text
    market_research = Column(Text, nullable=True)  # Markdown text
    customers = Column(Text, nullable=True)  # Markdown text
    financials = Column(Text, nullable=True)  # Markdown text
    funding = Column(Text, nullable=True)  # Markdown text
    risks = Column(Text, nullable=True)  # Markdown text
    roadmap = Column(Text, nullable=True)  # Markdown text
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="blueprint")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="messages")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(String, nullable=False)  # e.g., blueprint, financial, market, roadmap, pitch_deck
    version = Column(Integer, default=1)
    content = Column(Text, nullable=False)  # JSON or markdown serialized content
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="reports")
