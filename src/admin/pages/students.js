import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Divider,
  InputAdornment,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

// ----- FIREBASE -----
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
} from 'firebase/firestore';

// -- Your Firebase config --
const firebaseConfig = {
  apiKey: 'AIzaSyD6xgrttBIm9vw07xRltKsqHZNp1jJ8xw',
  authDomain: 'taistat-f0e1d.firebaseapp.com',
  projectId: 'taistat-f0e1d',
  storageBucket: 'taistat-f0e1d.firebasestorage.app',
  messagingSenderId: '196742294604',
  appId: '1:196742294604:web:715fe57bf6471221b898e9',
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ----- Named Export: Students -----
// Removed the original text; now it's just an empty box (or could be empty return).
export function Students() {
  return (
    <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
      {/* (No text, as requested) */}
    </div>
  );
}

// ----- Default Export: UsersList -----
export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch users in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          avatar: data.avatar || '',
          // Adjust these to match your Firestore fields
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          // Replacing location with audioCount
          audioCount: data.audioCount || 0,
          createdAt: data.createdAt
            ? data.createdAt.toDate() // Firestore Timestamp => JS Date
            : new Date(),
        };
      });
      setUsers(fetchedUsers);
    });
    return () => unsubscribe();
  }, []);

  // Filter by searchQuery (match on name or email)
  const filteredUsers = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      return (
        fullName.includes(lowerQuery) ||
        email.includes(lowerQuery)
      );
    });
  }, [users, searchQuery]);

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the array for the current page
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  // ----- RENDER -----
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>

      {/* SEARCH FILTER */}
      <Card sx={{ p: 2, maxWidth: '500px', mb: 3 }}>
        <OutlinedInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Search user by name or email"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
        />
      </Card>

      {/* TABLE */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox disabled />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                {/* Replace "Location" with "Audios" */}
                <TableCell>Audios</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Signed Up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => {
                const fullName = `${user.firstName} ${user.lastName}`;
                return (
                  <TableRow hover key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox disabled />
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ alignItems: 'center' }}
                      >
                        <Avatar src={user.avatar} />
                        <Typography variant="subtitle2">
                          {fullName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    {/* Display the user's audioCount instead of location */}
                    <TableCell>{user.audioCount}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.createdAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {/* The Students component with the removed text */}
      <Students />
    </Box>
  );
}
