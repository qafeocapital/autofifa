flowchart TD
    A[Start] --> B[Clone repo or pip install autofifa]
    B --> C[Create configuration file]
    C --> Z{Valid configuration?}
    Z -->|No| K[Display configuration error and guide user]
    K --> C
    Z -->|Yes| D[Show main CLI help]
    D --> E{Select command}
    E -->|ingest| F[Data ingestion process]
    F --> J{Ingestion errors?}
    J -->|Yes| K
    J -->|No| L[Write data to database]
    L --> D
    E -->|simulate| G[Simulation process]
    G --> M{Simulation errors?}
    M -->|Yes| K
    M -->|No| N[Generate simulation report]
    N --> D
    E -->|script| H[Execute automation script]
    H --> O{Script errors?}
    O -->|Yes| K
    O -->|No| P[Complete automation tasks]
    P --> D
    E -->|plugin| I[Manage plugins]
    I --> Q{Plugin load errors?}
    Q -->|Yes| K
    Q -->|No| R[List or install plugins]
    R --> D