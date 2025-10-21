# Admin Panel Functionality Guide

## Delete and Edit Buttons

### Current Status: ✅ FULLY FUNCTIONAL

Both the delete and edit buttons in the admin panel are already connected to the database and working correctly.

### How It Works

#### Delete Server
1. **Location**: Red "Delete" button in the top-right corner of each server card in the Servers tab
2. **Process**:
   - Click the Delete button
   - Confirmation dialog appears: "Are you sure you want to remove [server name]?"
   - If confirmed, the server is deleted from the Supabase `servers` table
   - Homepage and admin panel are automatically refreshed
   - Success message is displayed

3. **Code Flow**:
   \`\`\`
   User clicks Delete → handleRemoveServer() → removeServer() action
   → Supabase DELETE query → revalidatePath("/") → UI updates
   \`\`\`

#### Edit Server
1. **Location**: Blue "Edit" button in the top-right corner of each server card in the Servers tab
2. **Process**:
   - Click the Edit button
   - Server card switches to edit mode with form fields
   - Modify any fields (name, description, members, invite, logo, lead delegate)
   - Click "Save Changes" to update or "Cancel" to discard
   - Server is updated in the Supabase `servers` table
   - Homepage and admin panel are automatically refreshed
   - Success message is displayed

3. **Code Flow**:
   \`\`\`
   User clicks Edit → setEditingServer(id) → Form appears
   → User submits → handleUpdateServer() → updateServer() action
   → Supabase UPDATE query → revalidatePath("/") → UI updates
   \`\`\`

### Database Integration

Both operations use Supabase server actions:

**Delete**: `app/actions/remove-server.ts`
- Deletes from `servers` table by ID
- Revalidates homepage and admin panel cache
- Returns success/error message

**Edit**: `app/actions/update-server.ts`
- Updates `servers` table with new values
- Updates: name, description, members, invite, logo, lead_delegate_name, lead_delegate_discord_id
- Sets `updated_at` timestamp
- Revalidates homepage and admin panel cache
- Returns success/error message

### Website Auto-Update

When a server is deleted or edited, the website automatically updates because:

1. **Cache Revalidation**: Both actions call `revalidatePath("/")` which invalidates Next.js cache
2. **Homepage Refresh**: The homepage fetches fresh data from Supabase on next load
3. **Admin Panel Refresh**: The admin panel calls `loadData()` after successful operations
4. **Real-time Updates**: No manual refresh needed - changes appear immediately

### Error Handling

Both operations include comprehensive error handling:
- Database connection errors
- Invalid server IDs
- Missing required fields
- User-friendly error messages displayed in the admin panel

### Security

- Admin panel is password-protected
- All database operations use server actions (server-side only)
- Confirmation dialogs prevent accidental deletions
- Session timeout after 30 minutes of inactivity

## Testing the Functionality

1. Log into admin panel at `/admin` with password: `TheRealms&Sovereign3301!`
2. Go to the "Servers" tab
3. Find any server card
4. Look for the blue "Edit" and red "Delete" buttons in the top-right corner
5. Click Edit to modify server details
6. Click Delete to remove a server (with confirmation)
7. Check the homepage to see changes reflected immediately

## Troubleshooting

If buttons are not visible:
- Check browser console for errors
- Ensure the server card layout is not overflowing horizontally
- Try zooming out or using a wider screen
- The latest code fixes include proper text wrapping to prevent overflow

If operations fail:
- Check Supabase connection in environment variables
- Verify the `servers` table exists and has proper permissions
- Check browser console for detailed error messages
- Ensure you're logged into the admin panel
