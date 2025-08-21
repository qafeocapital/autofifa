# Backend Structure Document

This document explains the backend setup for **Autofifa**, a command-line framework that automates data ingestion, match simulations, and analysis of FIFA game data. We’ve used simple language so anyone can understand how the backend works, what technologies are involved, and how everything fits together.

## 1. Backend Architecture

### Overall Design
- The backend is written in **Python 3.8+** and organized as a single command-line application with clear modules for each feature:
  - **Ingestion Module**: Fetches and normalizes raw FIFA data.
  - **Simulation Engine**: Runs batch match simulations in parallel.
  - **Scripting Engine**: Executes user-written automation scripts.
  - **Plugin Manager**: Dynamically discovers and loads extensions.
- Commands are exposed via a CLI framework (either **Click** or **argparse**), offering a consistent user experience.

### Key Patterns and Frameworks
- **Plugin Architecture**: Uses Python’s `importlib` to keep core code separate from third-party extensions.
- **Configuration-Driven**: Reads settings from JSON/YAML files (via **PyYAML** and the built-in `json` module) so users can adjust behavior without editing code.
- **Parallel Processing**: Leverages Python’s concurrency tools to speed up simulations by running them simultaneously.

### Scalability, Maintainability, Performance
- **Scalability**: The plugin system and pluggable database make it easy to add new data sources or move to a bigger database (like PostgreSQL). Parallel simulations let you process large batches quickly.
- **Maintainability**: High test coverage (using **pytest**), code style enforced by **flake8** and **black**, and automated checks in **GitHub Actions** keep the codebase healthy.
- **Performance**: Target ingestion of ~100 MB/minute and 100 simulations in ~30 seconds on average hardware. Parallel execution and optional deterministic seeds ensure both speed and reproducibility.

## 2. Database Management

### Technologies Used
- **SQLite** (default): A lightweight, file-based database requiring no server setup.
- **PostgreSQL** or **MySQL** (optional): Easily swapped in via configuration when you need a more robust, server-based solution.

### Data Flow
1. **Ingestion Module** fetches raw match logs and player stats from external FIFA APIs.
2. **Parsers** transform raw records into a consistent internal format.
3. **Database Layer** writes normalized data into tables (see schema below).
4. **Simulation Engine** and **Analysis Tools** read from these tables to run simulations and generate reports.

### Data Management Practices
- **Atomic Writes & Rollbacks**: Partial failures during ingestion automatically roll back to keep data consistent.
- **Schema Validation**: Parsers enforce data shapes before writing, preventing malformed entries.
- **Configuration Versioning**: Database paths and credentials live in config files under version control, so changes are trackable.

## 3. Database Schema

### Human-Readable Overview
- **Players**: Basic info (ID, name, position, nationality).
- **Matches**: Match metadata (ID, date, competition, teams).
- **PlayerStats**: Per-match stats (goals, assists, minutes played).
- **Simulations**: Records of each simulation run (ID, parameters, timestamp).
- **SimulationResults**: Aggregated stats from simulations (win rates, possession percentages).

### SQL Schema (PostgreSQL Example)
```sql
CREATE TABLE players (
  player_id   SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  position    TEXT,
  nationality TEXT
);

CREATE TABLE matches (
  match_id     SERIAL PRIMARY KEY,
  match_date   DATE NOT NULL,
  competition  TEXT,
  home_team_id INT REFERENCES players(player_id),
  away_team_id INT REFERENCES players(player_id)
);

CREATE TABLE player_stats (
  id         SERIAL PRIMARY KEY,
  match_id   INT REFERENCES matches(match_id),
  player_id  INT REFERENCES players(player_id),
  goals      INT DEFAULT 0,
  assists    INT DEFAULT 0,
  minutes    INT DEFAULT 0
);

CREATE TABLE simulations (
  simulation_id   SERIAL PRIMARY KEY,
  config_seed     INT,
  team_lineup     JSONB,
  environment     JSONB,
  run_timestamp   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE simulation_results (
  id              SERIAL PRIMARY KEY,
  simulation_id   INT REFERENCES simulations(simulation_id),
  win_rate        FLOAT,
  avg_possession  FLOAT,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

## 4. API Design and Endpoints

Although Autofifa is a CLI tool rather than a web service, it exposes a clear set of “endpoints” via commands:

- **autofifa ingest**
  - Purpose: Fetch and store raw data.
  - Input: Configuration file (endpoints, credentials).
  - Output: Summary of records written to the database.

- **autofifa simulate**
  - Purpose: Run batch match simulations.
  - Flags: `--team`, `--seed`, `--report-format` (CSV/JSON).
  - Output: Simulation report file.

- **autofifa script**
  - Purpose: Execute user-written automation scripts.
  - Input: Path to a Python script using domain-specific commands.
  - Output: Success/failure messages and log details.

- **autofifa plugin**
  - Purpose: Manage plugins.
  - Subcommands: `list`, `install` (if supported), `remove`.
  - Output: Installed plugin names and status.

Internally, each command calls well-defined Python functions or service classes, ensuring a clean separation of concerns.

## 5. Hosting Solutions

### Local Environment (Default)
- Runs entirely on the user’s machine with no remote servers needed.
- Requires only Python 3.8+, the repository, and a local config file.

### Optional Containerization
- **Docker**: A Dockerfile can package Python, dependencies, and the code into a container for consistent setup.
- **Docker Compose**: Can spin up the service alongside a PostgreSQL container, if desired.

### Cloud Deployment (Advanced)
- Users can deploy Autofifa on any server or virtual machine (e.g., AWS EC2, Azure VM) for continuous ingestion or scheduled simulations.
- Use cron jobs or cloud-native schedulers (AWS Lambda + EventBridge) to run commands automatically.
- Store resulting reports in S3 or Azure Blob Storage if long-term archiving is needed.

## 6. Infrastructure Components

- **Version Control & Collaboration**
  - GitHub repository for code, issues, and pull requests.

- **Continuous Integration**
  - **GitHub Actions** automatically runs tests (pytest), linters (flake8), and format checks (black) on each pull request.

- **Package Registry**
  - PyPI for distributing releases (`pip install autofifa`).

- **Local File System & Database**
  - SQLite stores data locally by default.
  - Configuration files (`config.yaml` or `config.json`) live alongside the code.

- **Optional Monitoring & Scheduling**
  - Cron or cloud schedulers to automate `ingest` and `simulate` commands.
  - Basic logging to local files via Python’s `logging` module.

## 7. Security Measures

- **Credential Handling**
  - All API keys and database credentials are read from **environment variables** or external config files—**never hard-coded**.

- **Data Integrity**
  - Atomic database transactions and rollbacks prevent partial writes.
  - Parsers validate incoming data against expected schemas.

- **Secure Defaults**
  - Database file permissions restricted to the running user.
  - CLI help and error messages avoid leaking sensitive details.

- **Dependency Management**
  - Requirements pinned in `requirements.txt` to prevent unexpected version changes.

## 8. Monitoring and Maintenance

- **Logging**
  - Uses Python’s built-in `logging` to capture info, warning, and error messages.
  - Log level and format can be configured in the config file.

- **Automated Tests**
  - **pytest** suite covers data ingestion, simulation logic, and plugin loading.
  - High coverage (>80%) ensures confidence in changes.

- **Continuous Integration**
  - GitHub Actions runs tests and lint checks on every commit and pull request.

- **Upgrades**
  - New releases published on PyPI; users update via `pip install --upgrade autofifa`.
  - Changelog in the repository documents changes.

- **Support & Documentation**
  - Detailed `README.md` with setup, examples, and troubleshooting tips.
  - Inline code comments and help texts keep information close to the code.

## 9. Conclusion and Overall Backend Summary

Autofifa’s backend is a lean, modular Python application designed for local use with the flexibility to grow into more robust environments:

- A clear **module-based architecture** (ingest, simulate, script, plugin) keeps responsibilities separate.
- **SQLite by default** makes it easy to get started; swapping in PostgreSQL or MySQL is straightforward.
- A **CLI-first approach** means users control everything from their terminal, while built-in help and docs guide the way.
- **Security** and **data integrity** are built in through environment-based credentials and atomic database operations.
- **CI/CD**, code style enforcement, and automated tests ensure the backend remains reliable and maintainable.

Together, these components deliver a dependable, extensible backend that meets the project’s goals of automating FIFA data workflows without imposing a steep technical barrier.