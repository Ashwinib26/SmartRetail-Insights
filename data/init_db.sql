-- Create the database (run this in psql or via pgAdmin separately)
-- CREATE DATABASE retail_dashboard;

-- Switch to the database
-- \c retail_dashboard

-- Create user and assign privileges (run once)
-- CREATE USER retail_user WITH PASSWORD 'yourpassword';
-- GRANT ALL PRIVILEGES ON DATABASE retail_dashboard TO retail_user;

-- Drop tables if they already exist
DROP TABLE IF EXISTS sales_forecast;
DROP TABLE IF EXISTS inventory;

-- Create sales_forecast table
CREATE TABLE sales_forecast (
    id SERIAL PRIMARY KEY,
    store_id INT,
    date DATE,
    promo INT,
    school_holiday INT,
    state_holiday VARCHAR(1),
    sales INT,
    forecast INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into sales_forecast
INSERT INTO sales_forecast (store_id, date, promo, school_holiday, state_holiday, sales, forecast)
VALUES
(1, '2023-06-01', 1, 0, '0', 5400, 5500),
(2, '2023-06-01', 0, 1, 'a', 4100, 4300),
(1, '2023-06-02', 1, 0, '0', 5800, 6000);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item VARCHAR(255),
    category VARCHAR(100),
    location VARCHAR(100),
    stock INT,
    alert BOOLEAN
);

INSERT INTO inventory (item, category, location, stock, alert)
VALUES
('TV', 'Electronics', 'Warehouse A', 5, TRUE),
('Laptop', 'Electronics', 'Warehouse B', 20, FALSE),
('Refrigerator', 'Appliances', 'Warehouse A', 2, TRUE),
('Microwave', 'Appliances', 'Warehouse B', 15, FALSE);



DELIMITER //

CREATE TRIGGER update_alert
BEFORE UPDATE ON inventory
FOR EACH ROW
BEGIN
  IF NEW.demand > NEW.stock THEN
    SET NEW.alert = 1;
  ELSE
    SET NEW.alert = 0;
  END IF;
END;
//

DELIMITER ;