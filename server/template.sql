CREATE TABLE user (
    username VARCHAR(222) PRIMARY KEY,
    pwd_hash VARCHAR(222),
    administrator TINYINT(1) DEFAULT 0
);