-- create new database
CREATE DATABASE business_db;

DROP DATABASE business_db;

USE business_db;

-- create sales table
CREATE TABLE sales (
		order_id INT,
        customer_id INT,
        product VARCHAR(100),
        price DECIMAL(10,2),
        units_sold INT,
        region VARCHAR(50),
        order_date DATE,
        amount DECIMAL(10,2),
		channel VARCHAR(50)
);

-- create operation table
CREATE TABLE operations (
    order_id INT,
    warehouse_id VARCHAR(20),
    inventory_level INT,
    shipment_date DATE,
    fulfillment_days INT
);

-- create crm table
CREATE TABLE crm (
	customer_id INT,
    lead_id INT,
    lead_status VARCHAR(50),
	last_contact_date DATE,
    conversion_rate DECIMAL(5,2)
);

-- create table finance
CREATE TABLE finance (
    invoice_id INT,
    order_id INT,
    expense_category VARCHAR(50),
    amount DECIMAL(10,2),
    budget DECIMAL(10, 2),
    payment_status VARCHAR(50),
    due_date DATE,
    expense_type VARCHAR(20),
    last_payment_date DATE,
    remainder_sent DATE
);


SELECT * FROM sales;

SELECT * FROM operations;

SELECT * FROM crm;

SELECT * FROM finance;

-- Top 5 Customers by Total Revenue
SELECT 
    customer_id,
    SUM(amount) AS total_revenue
FROM sales
GROUP BY customer_id
ORDER BY total_revenue DESC
LIMIT 5;

-- Overdue Payments by Region
SELECT 
    s.region,
    COUNT(*) AS overdue_payments,
    SUM(f.amount) AS overdue_amount
FROM sales s
JOIN finance f
    ON s.order_id = f.order_id
WHERE f.payment_status = 'Overdue'
GROUP BY s.region;

-- Lead-to-Sale Conversion
SELECT 
    c.lead_status,
    COUNT(DISTINCT c.customer_id) AS leads,
    COUNT(DISTINCT s.customer_id) AS converted_customers
FROM crm c
LEFT JOIN sales s
    ON c.customer_id = s.customer_id
GROUP BY c.lead_status;

-- Average Fulfillment Time by Region
SELECT 
    s.region,
    AVG(o.fulfillment_days) AS avg_fulfillment_days
FROM sales s
JOIN operations o
    ON s.order_id = o.order_id
GROUP BY s.region;

-- Revenue by Sales Channel
SELECT 
    channel,
    SUM(amount) AS total_revenue
FROM sales
GROUP BY channel;