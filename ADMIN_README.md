# Admin Dashboard - User Guide

## Default Admin Credentials

A default admin user has been created for you:

- **Email**: `admin@arfaoui-law.com`
- **Password**: `Admin@123`

**Important**: Please change this password after your first login for security reasons.

## Accessing the Admin Dashboard

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to the admin login page:

   ```
   http://localhost:3000/admin/login
   ```

3. Login with the default credentials above

4. You'll be redirected to the dashboard at `/admin/dashboard`

## Managing Admin Users

### List All Admins

View all admin users in the database:

```bash
npm run admin:list
```

### Create a New Admin

Create a new admin user interactively:

```bash
npm run admin:create
```

You'll be prompted to enter:

- Admin name
- Email address
- Password

### Delete an Admin

Remove an admin user:

```bash
npm run admin:delete
```

You'll be prompted to enter the email address of the admin to delete.

## Admin Dashboard Features

### Current Features

- **Secure Authentication**: Token-based authentication with HTTP-only cookies
- **Protected Routes**: All admin routes are automatically protected by middleware
- **Responsive Design**: Mobile-friendly sidebar and layout
- **User Management**: View current user info and logout functionality

### Dashboard Sections

- **Dashboard Home** (`/admin/dashboard`): Overview with stats and quick actions
- **Content** (`/admin/dashboard/content`): Manage website content (to be implemented)
- **Settings** (`/admin/dashboard/settings`): Configure site settings (to be implemented)

## Security Features

1. **JWT Authentication**: Secure token-based authentication with 7-day expiration
2. **HTTP-Only Cookies**: Tokens stored in secure HTTP-only cookies
3. **Password Hashing**: Passwords hashed using bcrypt with salt rounds
4. **Middleware Protection**: Automatic route protection for all `/admin/*` routes
5. **Auto-Redirect**: Unauthenticated users redirected to login page

## Database Schema

### admin_users Table

```sql
- id: Serial (Primary Key)
- email: Unique, NOT NULL
- password: Hashed password
- name: Admin name
- role: User role (default: 'admin')
- created_at: Timestamp
- updated_at: Timestamp
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current authenticated user

## Troubleshooting

### Can't Login?

1. Verify your credentials
2. Check that the database is running
3. Verify `.env` file exists with correct database credentials
4. Run `npm run admin:list` to verify admin user exists

### Port Already in Use?

If port 3000 is already in use, Next.js will automatically use the next available port (e.g., 3001).

## Next Steps

Extend the dashboard by:

1. Adding content management features
2. Implementing blog post CRUD operations
3. Adding analytics and reporting
4. Creating user feedback management
5. Implementing file upload functionality

---

For technical support or questions, refer to the main project documentation.
