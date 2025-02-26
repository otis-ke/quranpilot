'use client';

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Grid
} from '@mui/material';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

/** --- FIREBASE CONFIG --- */
const firebaseConfig = {
  apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNp1jJ8xw",
  authDomain: "taistat-f0e1d.firebaseapp.com",
  projectId: "taistat-f0e1d",
  storageBucket: "taistat-f0e1d.firebasestorage.app",
  messagingSenderId: "196742294604",
  appId: "1:196742294604:web:715fe57bf6471221b898e9",
};

// Initialize Firebase (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Combined logic: Fetch user data from localStorage and subscribe to Firestore updates
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      setLoading(false);
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    // Set initial user data from localStorage
    setUser(parsedUserData);

    // If an email is present, subscribe to Firestore for real-time updates
    if (parsedUserData?.email) {
      const unsub = onSnapshot(doc(db, 'users', parsedUserData.email), (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
        setLoading(false);
      });
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.email) return;

    const form = event.currentTarget;
    const updatedUser = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      state: form.state.value,
      city: form.city.value,
    };

    try {
      // Update the user doc in Firestore
      const userDocRef = doc(db, 'users', user.email);
      await updateDoc(userDocRef, updatedUser);
      alert('Profile updated!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile.');
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>No user data found. Please log in or check your config.</div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      {/* Left side: Account Info Card */}
      <Card sx={{ width: 320, maxWidth: '100%' }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Avatar
              src={user.avatarUrl || '/assets/avatar.png'}
              sx={{ height: 80, width: 80 }}
            />
            <Stack spacing={1} textAlign="center">
              <Typography variant="h5">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user.city} {user.state}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user.timezone || 'GTM-7'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        {/* Upload picture button removed */}
      </Card>

      {/* Right side: Account Details Form */}
      <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 300 }}>
        <Card>
          <CardHeader subheader="About" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput
                    name="firstName"
                    label="First name"
                    defaultValue={user.firstName || ''}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput
                    name="lastName"
                    label="Last name"
                    defaultValue={user.lastName || ''}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput
                    name="email"
                    label="Email address"
                    defaultValue={user.email || ''}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Phone number</InputLabel>
                  <OutlinedInput
                    name="phone"
                    label="Phone number"
                    type="tel"
                    defaultValue={user.phone || ''}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <OutlinedInput
                    name="state"
                    label="State"
                    defaultValue={user.state || ''}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <OutlinedInput
                    name="city"
                    label="City"
                    defaultValue={user.city || ''}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          {/* Save details button removed */}
        </Card>
      </form>
    </div>
  );
}
