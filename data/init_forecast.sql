CREATE DATABASE IF NOT EXISTS retail_dashboard;
USE retail_dashboard;

-- Table to store input features used in the forecast
DROP TABLE IF EXISTS sales_forecast_input;
CREATE TABLE sales_forecast_input (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100),
    store INT,
    day_of_week INT,
    promo TINYINT,
    school_holiday TINYINT,
    state_holiday_0 TINYINT,
    state_holiday_a TINYINT,
    state_holiday_b TINYINT,
    state_holiday_c TINYINT,
    store_type_a TINYINT,
    store_type_b TINYINT,
    store_type_c TINYINT,
    store_type_d TINYINT,
    assortment_a TINYINT,
    assortment_b TINYINT,
    assortment_c TINYINT,
    promo2 TINYINT,
    promo2_since_week INT,
    promo2_since_year INT,
    competition_distance FLOAT,
    competition_open_since_month INT,
    competition_open_since_year INT,
    promo_interval_feb_may_aug_nov TINYINT,
    promo_interval_jan_apr_jul_oct TINYINT,
    promo_interval_mar_jun_sept_dec TINYINT,
    promo_interval_none TINYINT,
    forecast_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store forecast results
DROP TABLE IF EXISTS sales_forecast_output;
CREATE TABLE sales_forecast_output (
    id INT AUTO_INCREMENT PRIMARY KEY,
    input_id INT,
    category VARCHAR(100),
    region VARCHAR(100),
    forecast_day_1 INT,
    forecast_day_2 INT,
    forecast_day_3 INT,
    forecast_day_4 INT,
    forecast_day_5 INT,
    forecast_day_6 INT,
    forecast_day_7 INT,
    FOREIGN KEY (input_id) REFERENCES sales_forecast_input(id) ON DELETE CASCADE
);

-- Table to store inventory details
DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(255),
    category VARCHAR(100),
    location VARCHAR(100),
    stock INT,
    alert BOOLEAN
);
