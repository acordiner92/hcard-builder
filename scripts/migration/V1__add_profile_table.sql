CREATE TABLE PROFILE(
   id UUID PRIMARY KEY,
   account_id UUID UNIQUE NOT NULL,
   given_name TEXT NOT NULL,
   surname TEXT NOT NULL,
   email TEXT NOT NULL,
   phone TEXT NOT NULL,
   house_number INT NOT NULL, 
   street TEXT NOT NULL,
   suburb TEXT NOT NULL,
   state TEXT NOT NULL,
   postcode TEXT NOT NULL,
   country TEXT NOT NULL
);