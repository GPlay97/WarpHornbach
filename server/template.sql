CREATE TABLE IF NOT EXISTS user (
    username VARCHAR(222) PRIMARY KEY,
    pwd_hash VARCHAR(222) NOT NULL,
    administrator TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS activity (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(222) NOT NULL,
    activity_time INT(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS revenue (
    salary INT(11) NOT NULL,
    factor FLOAT NOT NULL,
    profit INT(11) NOT NULL
);

INSERT INTO revenue (salary, factor, profit) VALUES (3000, 0.5, 1000);