-- ============================================================
-- Expense Tracker - Complete Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    refresh_token TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- EXPENSE CATEGORIES
-- ============================================================
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_user ON expense_categories(user_id);

-- Insert default categories (system-level, user_id = NULL)
INSERT INTO expense_categories (name, icon, color, is_default) VALUES
    ('Food', 'utensils', '#F97316', TRUE),
    ('Travel', 'car', '#3B82F6', TRUE),
    ('Rent', 'home', '#8B5CF6', TRUE),
    ('Electricity', 'zap', '#EAB308', TRUE),
    ('Shopping', 'shopping-bag', '#EC4899', TRUE),
    ('Medicine', 'heart-pulse', '#EF4444', TRUE),
    ('Bills', 'receipt', '#6B7280', TRUE),
    ('Entertainment', 'tv', '#14B8A6', TRUE),
    ('Others', 'more-horizontal', '#9CA3AF', TRUE);

-- ============================================================
-- MONTHLY BUDGETS
-- ============================================================
CREATE TABLE monthly_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    total_budget DECIMAL(12,2) NOT NULL,
    fixed_expenses_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    savings_goal DECIMAL(12,2) NOT NULL DEFAULT 0,
    flexible_budget DECIMAL(12,2) GENERATED ALWAYS AS (total_budget - fixed_expenses_total - savings_goal) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

CREATE INDEX idx_monthly_budgets_user ON monthly_budgets(user_id);
CREATE INDEX idx_monthly_budgets_period ON monthly_budgets(user_id, year, month);

-- ============================================================
-- FIXED EXPENSES
-- ============================================================
CREATE TABLE fixed_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    budget_id UUID NOT NULL REFERENCES monthly_budgets(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id),
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fixed_expenses_budget ON fixed_expenses(budget_id);

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id),
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    notes TEXT,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'CASH',
    expense_date DATE NOT NULL,
    week_number INTEGER,
    month INTEGER,
    year INTEGER,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(user_id, expense_date);
CREATE INDEX idx_expenses_period ON expenses(user_id, year, month);
CREATE INDEX idx_expenses_category ON expenses(category_id);

-- ============================================================
-- RECURRING EXPENSES
-- ============================================================
CREATE TABLE recurring_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id),
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    next_due_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recurring_user ON recurring_expenses(user_id);

-- ============================================================
-- WEEKLY SUMMARIES
-- ============================================================
CREATE TABLE weekly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    budget_id UUID NOT NULL REFERENCES monthly_budgets(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    weekly_budget DECIMAL(12,2) NOT NULL,
    total_spent DECIMAL(12,2) NOT NULL DEFAULT 0,
    remaining DECIMAL(12,2) GENERATED ALWAYS AS (weekly_budget - total_spent) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, week_number, month, year)
);

CREATE INDEX idx_weekly_summaries_user ON weekly_summaries(user_id);

-- ============================================================
-- GROUPS
-- ============================================================
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_groups_created_by ON groups(created_by);

-- ============================================================
-- GROUP MEMBERS
-- ============================================================
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- ============================================================
-- GROUP EXPENSES
-- ============================================================
CREATE TABLE group_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    paid_by UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES expense_categories(id),
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    notes TEXT,
    split_type VARCHAR(20) NOT NULL DEFAULT 'EQUAL',
    expense_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_group_expenses_group ON group_expenses(group_id);
CREATE INDEX idx_group_expenses_paid_by ON group_expenses(paid_by);

-- ============================================================
-- GROUP EXPENSE SPLITS
-- ============================================================
CREATE TABLE group_expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES group_expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    share_amount DECIMAL(12,2) NOT NULL,
    is_settled BOOLEAN NOT NULL DEFAULT FALSE,
    settled_at TIMESTAMP,
    UNIQUE(expense_id, user_id)
);

CREATE INDEX idx_splits_expense ON group_expense_splits(expense_id);
CREATE INDEX idx_splits_user ON group_expense_splits(user_id);

-- ============================================================
-- SETTLEMENTS
-- ============================================================
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL,
    notes TEXT,
    settled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settlements_group ON settlements(group_id);
CREATE INDEX idx_settlements_payer ON settlements(payer_id);
CREATE INDEX idx_settlements_receiver ON settlements(receiver_id);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_budgets_updated_at BEFORE UPDATE ON monthly_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_expenses_updated_at BEFORE UPDATE ON group_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_summaries_updated_at BEFORE UPDATE ON weekly_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
