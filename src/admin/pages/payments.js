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
export function Students() {
  // Empty (or you can render something else if you wish)
  return <div />;
}

// ----- Default Export: PaymentsList -----
export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch payments in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'payments'), (snapshot) => {
      const fetchedPayments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          // Adjust these fields to match your Firestore structure
          userName: data.userName || '',
          userEmail: data.userEmail || '',
          paymentStatus: data.paymentStatus || '',
          amount: data.amount || 0,
          createdAt: data.createdAt
            ? data.createdAt.toDate() // Firestore Timestamp => JS Date
            : new Date(),
        };
      });
      setPayments(fetchedPayments);
    });
    return () => unsubscribe();
  }, []);

  // Filter by searchQuery (match on userName or userEmail)
  const filteredPayments = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return payments.filter((pmt) => {
      const name = pmt.userName.toLowerCase();
      const email = pmt.userEmail.toLowerCase();
      return name.includes(lowerQuery) || email.includes(lowerQuery);
    });
  }, [payments, searchQuery]);

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the array for the current page
  const paginatedPayments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayments, page, rowsPerPage]);

  // ----- RENDER -----
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Payments
      </Typography>

      {/* SEARCH FILTER */}
      <Card sx={{ p: 2, maxWidth: '500px', mb: 3 }}>
        <OutlinedInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          placeholder="Search by user name or email"
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
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.map((pmt) => (
                <TableRow hover key={pmt.id}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: 'center' }}
                    >
                      {/* Example avatar if you had a user avatar in the doc */}
                      <Avatar src="" />
                      <Typography variant="subtitle2">
                        {pmt.userName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{pmt.userEmail}</TableCell>
                  <TableCell>{pmt.paymentStatus}</TableCell>
                  <TableCell>{pmt.amount}</TableCell>
                  <TableCell>
                    {pmt.createdAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={filteredPayments.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      {/* Render the Students component if desired */}
      <Students />
    </Box>
  );
}
