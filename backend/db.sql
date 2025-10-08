-- Create users table
CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL
);

-- Seed users table
INSERT INTO users (user_id, email, name, created_at) VALUES
('user1', 'alice@example.com', 'Alice', '2023-10-01T10:00:00Z'),
('user2', 'bob@example.com', 'Bob', '2023-10-02T11:00:00Z'),
('user3', 'carol@example.com', 'Carol', '2023-10-03T12:00:00Z');

-- Create plants table
CREATE TABLE plants (
    plant_id VARCHAR PRIMARY KEY NOT NULL,
    scientific_name VARCHAR NOT NULL,
    common_name VARCHAR NOT NULL,
    description VARCHAR,
    care_guidelines VARCHAR,
    photos VARCHAR,
    type VARCHAR,
    light_requirement VARCHAR,
    watering_needs VARCHAR,
    user_reviews VARCHAR
);

-- Seed plants table
INSERT INTO plants (plant_id, scientific_name, common_name, description, care_guidelines, photos, type, light_requirement, watering_needs, user_reviews) VALUES
('plant1', 'Ficus lyrata', 'Fiddle Leaf Fig', 'A popular houseplant.', 'Water weekly.', 'https://picsum.photos/200/300?random=1', 'Indoor', 'Bright', 'Moderate', 'Great plant to have!'),
('plant2', 'Monstera deliciosa', 'Swiss Cheese Plant', 'Famous for its leaves with holes.', 'Keep soil moist but not soggy.', 'https://picsum.photos/200/300?random=2', 'Indoor', 'Indirect sunlight', 'High', 'Very easy to care for.'),
('plant3', 'Rosa', 'Rose', 'Known for beautiful flowers.', 'Prune regularly.', 'https://picsum.photos/200/300?random=3', 'Outdoor', 'Full sun', 'High', 'Amazing blooms!');

-- Create care_guides table
CREATE TABLE care_guides (
    guide_id VARCHAR PRIMARY KEY NOT NULL,
    plant_family VARCHAR,
    content VARCHAR NOT NULL,
    created_by VARCHAR NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Seed care_guides table
INSERT INTO care_guides (guide_id, plant_family, content, created_by) VALUES
('guide1', 'Ficus', 'Ficus requires bright, indirect light.', 'user1'),
('guide2', 'Monstera', 'Prefers indirect sunlight and moderate watering.', 'user2');

-- Create forum_posts table
CREATE TABLE forum_posts (
    post_id VARCHAR PRIMARY KEY NOT NULL,
    user_id VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Seed forum_posts table
INSERT INTO forum_posts (post_id, user_id, content, created_at, topic) VALUES
('post1', 'user1', 'What are the best plants for low light?', '2023-10-05T08:00:00Z', 'Plant Care'),
('post2', 'user2', 'Tips on propagating succulents?', '2023-10-06T09:00:00Z', 'Propagation');

-- Create forum_replies table
CREATE TABLE forum_replies (
    reply_id VARCHAR PRIMARY KEY NOT NULL,
    post_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Seed forum_replies table
INSERT INTO forum_replies (reply_id, post_id, user_id, content, created_at) VALUES
('reply1', 'post1', 'user3', 'Try snake plants!', '2023-10-05T09:30:00Z'),
('reply2', 'post2', 'user1', 'Be sure to let the cut end dry first.', '2023-10-06T10:30:00Z');

-- Create plant_marketplace table
CREATE TABLE plant_marketplace (
    listing_id VARCHAR PRIMARY KEY NOT NULL,
    user_id VARCHAR NOT NULL,
    plant_id VARCHAR NOT NULL,
    condition VARCHAR NOT NULL,
    desired_trade VARCHAR,
    status VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plant_id) REFERENCES plants(plant_id)
);

-- Seed plant_marketplace table
INSERT INTO plant_marketplace (listing_id, user_id, plant_id, condition, desired_trade, status, created_at) VALUES
('listing1', 'user1', 'plant1', 'Healthy', 'Any succulent', 'Available', '2023-10-07T14:00:00Z'),
('listing2', 'user2', 'plant2', 'Good', NULL, 'Available', '2023-10-08T15:00:00Z');

-- Create trade_requests table
CREATE TABLE trade_requests (
    request_id VARCHAR PRIMARY KEY NOT NULL,
    listing_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES plant_marketplace(listing_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Seed trade_requests table
INSERT INTO trade_requests (request_id, listing_id, user_id, status, created_at) VALUES
('request1', 'listing1', 'user3', 'Pending', '2023-10-09T16:00:00Z'),
('request2', 'listing2', 'user1', 'Accepted', '2023-10-10T17:00:00Z');

-- Create user_activity table
CREATE TABLE user_activity (
    activity_id VARCHAR PRIMARY KEY NOT NULL,
    user_id VARCHAR NOT NULL,
    activity_type VARCHAR NOT NULL,
    reference_id VARCHAR,
    created_at VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Seed user_activity table
INSERT INTO user_activity (activity_id, user_id, activity_type, reference_id, created_at) VALUES
('activity1', 'user1', 'Posted', 'post1', '2023-10-05T08:00:00Z'),
('activity2', 'user2', 'Listed', 'listing2', '2023-10-08T15:00:00Z');

-- Create user_favorites table
CREATE TABLE user_favorites (
    favorite_id VARCHAR PRIMARY KEY NOT NULL,
    user_id VARCHAR NOT NULL,
    plant_id VARCHAR NOT NULL,
    saved_at VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plant_id) REFERENCES plants(plant_id)
);

-- Seed user_favorites table
INSERT INTO user_favorites (favorite_id, user_id, plant_id, saved_at) VALUES
('favorite1', 'user1', 'plant2', '2023-10-05T13:00:00Z'),
('favorite2', 'user3', 'plant1', '2023-10-07T14:00:00Z');