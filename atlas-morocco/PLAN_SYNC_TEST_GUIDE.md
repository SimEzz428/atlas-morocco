# Plan Sync Test Guide

## Issue
Places added from city pages are not showing up in the trip planner.

## What Was Fixed
1. **Added client-side check**: The `usePlan` hook now ensures it only runs on the client side to avoid SSR issues
2. **Cleaned up debugging**: Removed excessive console logs
3. **Maintained localStorage sync**: Plan data is stored in `localStorage` with key `atlas.plan.v1`
4. **Automatic cloud sync**: When authenticated, plans sync to cloud every 1 second after changes

## How to Test

### Step 1: Open the City Page
1. Navigate to `http://localhost:3000/cities/marrakech`
2. You should see the "Places (10)" tab selected by default
3. You should see 6 attractions listed with "Add to Plan" buttons

### Step 2: Add Places to Plan
1. Click the "Add to Plan" button next to "Jemaa el-Fnaa"
2. The button should change to "Added!" briefly, then show "In Plan" with a green background
3. Click "Add to Plan" on "Majorelle Garden"
4. Repeat for any other attractions you want

### Step 3: Check the Trip Planner
1. Click "Plan Trip" in the navigation bar or go to `http://localhost:3000/plan`
2. You should see:
   - The places you added listed in the "Trip Timeline" section
   - The route map showing markers for each place
   - The places organized by day

### Step 4: Verify Persistence
1. Refresh the page
2. The places should still be in your plan (loaded from localStorage)
3. Navigate back to Marrakech city page
4. The "Add to Plan" buttons for places you added should show "In Plan" (green)

### Step 5: Test Cloud Sync (if signed in)
1. Sign in at `http://localhost:3000/auth/signin`
2. Add places to your plan
3. You should see "Auto-synced to cloud" indicator in the trip planner
4. Check browser console for any errors

## Debugging

If it's still not working, open browser Developer Tools (F12) and:

1. **Check Console for Errors**: Look for any JavaScript errors
2. **Check localStorage**: 
   - Open Console tab
   - Type: `localStorage.getItem('atlas.plan.v1')`
   - You should see your plan JSON
3. **Check Network Tab**: 
   - Look for `POST /api/plan` requests when signed in
   - Should return 200 OK

## Known Behavior
- Plans are stored locally in browser localStorage
- When signed in, plans automatically sync to cloud
- Sync happens 1 second after any change (debounced)
- Manual sync buttons have been removed (sync is now automatic)

## If It's Still Not Working

The most likely issue is that the `usePlan` hook is creating separate instances for each page. This shouldn't happen because:
1. `usePlan` uses localStorage which is shared across all pages
2. Each component using `usePlan` reads from the same localStorage key
3. Changes to localStorage trigger re-renders in all components using the hook

However, if you're seeing the issue persist, please:
1. Open browser console
2. Click "Add to Plan" on a city page
3. Check if localStorage is updated: `localStorage.getItem('atlas.plan.v1')`
4. Navigate to `/plan` page
5. Check if it reads from localStorage on mount
6. Share any console errors you see

