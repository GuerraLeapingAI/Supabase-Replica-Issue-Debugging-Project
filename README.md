# Supabase Replica Issue Debugging Project

This project is a minimal Next.js application designed to demonstrate an issue when accessing data via a Supabase replica URL using the anonymous key. It showcases the problem and provides a clear environment to help debug the configuration.

## Problem Description

### Context

Dear Supabase Support Team,

I hope this message finds you well. I’d like to reopen this issue, as I am still facing challenges with accessing data via the replica URL.

Using the `service_role_key` works because it bypasses all security layers, but this is not a viable option since I cannot set the `service_role_key` in the client’s environment variables for security reasons.

### Problem Summary

I am using a replica URL to read tables and some views.

- For the main Supabase URL, I create the client using the anonymous key, and it works as expected.
- However, when using the replica URL with the same anonymous key, all responses return empty.

### Steps Taken

1. Verified that all tables have Row Level Security (RLS) policies that explicitly allow reading with the anonymous key.
2. Temporarily disabled RLS for the relevant tables, but the issue persisted.
3. Added a policy for the `calls` table explicitly allowing read access to all users using the following SQL:
   ```sql
   ALTER POLICY "Enable read access for all users"
   ON "public"."calls"
   TO public
   USING (true);
   ```

Despite these efforts, I am still unable to retrieve data from the replica URL using the anonymous key.

### Questions

1. Should I use any other key and set specific policies to use with the replica?
2. Is there a specific configuration required in the Supabase client to support replicas?

---

## How to Run the Project

### Prerequisites

- Node.js installed (v16+ recommended)
- NPM or Yarn installed
- Supabase account with main and replica URLs and corresponding anonymous keys

### Steps

1. **Clone the Repository**
   

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the root of the project and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-main-supabase-url
   NEXT_PUBLIC_SUPABASE_URL_REPLICA=your-replica-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

6. **Test the Functionality**
   - Log in using valid Supabase credentials (e.g., demo account).
   - Click on the buttons to fetch data from the main and replica databases.
   - Observe the responses for both the tables and views.

7. **Clear Responses**
   Use the "Clear" buttons next to each section title to reset the displayed results.

### Project Structure

```
project/
├── pages/
│   └── index.tsx        # Main interface with login and data fetch tests
├── supabase.ts          # Supabase client configuration and service methods
├── supabaseGeneratedTypes.d.ts # Supabase types (if any)
├── .env.local           # Environment variables (not included in the repo)
├── package.json         # Project dependencies and scripts
└── README.md            # Documentation
```

---

## Expected Behavior

- **Main Database**: Successfully fetches data using the anonymous key.
- **Replica Database**: Returns empty responses, even when RLS is disabled and policies are configured to allow public read access.

---

## Troubleshooting Notes

- The project is designed to isolate the issue and does not use a `service_role_key` for security reasons.
- Ensure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL_REPLICA` values are correct and point to your Supabase main and replica URLs, respectively.
- Verify that RLS policies and table/view configurations match between the main and replica environments.

---

## Contact

If additional details are required, please feel free to contact:

**Gabriel Bio Guerra**
Email: [gabriel.guerra@leapingai.com](mailto:gabriel.guerra@leapingai.com)

