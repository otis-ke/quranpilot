import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ArrowDown as ArrowDownIcon,
  ArrowUp as ArrowUpIcon,
  CurrencyDollar as CurrencyDollarIcon,
  Users as UsersIcon,
  Desktop as DesktopIcon,
  DeviceTablet as DeviceTabletIcon,
  Phone as PhoneIcon,
  ArrowClockwise as ArrowClockwiseIcon,
  ArrowRight as ArrowRightIcon
} from '@phosphor-icons/react';
import ReactApexChart from 'react-apexcharts';

// Firebase imports
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase Config & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyD6xgrttBIm9vw07xRltKsqHZNp1jJ8xw",
  authDomain: "taistat-f0e1d.firebaseapp.com",
  projectId: "taistat-f0e1d",
  storageBucket: "taistat-f0e1d.appspot.com",
  messagingSenderId: "196742294604",
  appId: "1:196742294604:web:715fe57bf6471221b898e9",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Reusable Chart component
function Chart(props) {
  return <ReactApexChart {...props} />;
}

// 1) Payments Card (formerly BudgetCard)
function PaymentsCard({ paymentsData }) {
  const trend = paymentsData.trend || 'up';
  const diff = paymentsData.diff || 12;
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'green' : 'red';

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Payments
              </Typography>
              <Typography variant="h4">${paymentsData.amount}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
              <CurrencyDollarIcon fontSize={32} />
            </Avatar>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <TrendIcon color={trendColor} fontSize={20} />
              <Typography color={trendColor} variant="body2">
                {diff}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// 2) Total Customers Card (fetching count from db)
function TotalCustomersCard({ totalCustomers }) {
  const diff = 16; // dummy value
  const TrendIcon = ArrowDownIcon;
  const trendColor = 'red';

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Customers
              </Typography>
              <Typography variant="h4">{totalCustomers}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'success.main', height: 56, width: 56 }}>
              <UsersIcon fontSize={32} />
            </Avatar>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <TrendIcon color={trendColor} fontSize={20} />
              <Typography color={trendColor} variant="body2">
                {diff}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// 3) User Activity Card (formerly TaskProgressCard)
function UserActivityCard({ activityPercentage }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography color="text.secondary" variant="overline">
            User Activity
          </Typography>
          <Typography variant="h4">{activityPercentage}%</Typography>
          <LinearProgress variant="determinate" value={activityPercentage} sx={{ height: 8, borderRadius: 4 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

// 4) User Activity Trend Chart (formerly SalesCard)
function UserActivityTrendCard() {
  const theme = useTheme();

  const chartSeries = [
    {
      name: 'Activity',
      data: [65, 70, 75, 80, 78, 85, 90, 88, 92, 95, 93, 97]
    }
  ];

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: { show: false }
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } }
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}%`,
        offsetX: -10,
        style: { colors: theme.palette.text.secondary }
      }
    }
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize={20} />}>
            Sync
          </Button>
        }
        title="User Activity Trend"
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize={20} />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

// 5) Traffic Card (unchanged)
function TrafficCard() {
  const theme = useTheme();

  const labels = ['Desktop', 'Tablet', 'Phone'];
  const chartSeries = [63, 17, 20];

  const chartOptions = {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels: labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'none' } }
    },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false }
  };

  const iconMapping = {
    Desktop: DesktopIcon,
    Tablet: DeviceTabletIcon,
    Phone: PhoneIcon
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader title="Traffic source" />
      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const IconComp = iconMapping[label];
              return (
                <Stack key={label} spacing={1} sx={{ alignItems: 'center' }}>
                  {IconComp ? <IconComp fontSize={32} /> : null}
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {item}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// 6) Registered Users Card (formerly Latest Products)
function RegisteredUsersCard({ users }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader title="Registered Users" />
      <CardContent>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

// 7) Audio Files Card (formerly Latest Orders)
function AudioCard({ audioFiles }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader title="Audio Files" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Audio ID</TableCell>
              <TableCell>From</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audioFiles.map((audio) => (
              <TableRow key={audio.id}>
                <TableCell>{audio.id}</TableCell>
                <TableCell>{audio.senderName}</TableCell>
                <TableCell>{new Date(audio.timestamp).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [paymentsData, setPaymentsData] = useState({ amount: 0, trend: 'up', diff: 12 });
  const [activityPercentage] = useState(75); // Dummy percentage for user activity

  // Fetch all users from Firestore and then audio messages from each user's subcollection
  useEffect(() => {
    const fetchUsersAndAudio = async () => {
      try {
        // Fetch users from "users" collection
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);

        // Calculate total payments (assuming each user document has a "payment" field)
        const totalPayments = usersData.reduce((acc, user) => acc + (Number(user.payment) || 0), 0);
        // If totalPayments is 0, use default value (e.g. 0)
        setPaymentsData({
          amount: totalPayments === 0 ? 0 : totalPayments,
          trend: 'up',
          diff: 12
        });

        // For each user, fetch messages with an "audio" field from the subcollection "messages"
        let allAudioFiles = [];
        await Promise.all(
          usersData.map(async (user) => {
            const messagesSnapshot = await getDocs(collection(db, `users/${user.email}/messages`));
            messagesSnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.audio) {
                allAudioFiles.push({
                  id: doc.id,
                  senderName: data.senderName,
                  timestamp: data.timestamp
                });
              }
            });
          })
        );
        setAudioFiles(allAudioFiles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsersAndAudio();
  }, []);

  // Total customers equals the number of users
  const totalCustomers = users.length;

  return (
    <Stack spacing={3} sx={{ padding: 2 }}>
      {/* Top row: Summary cards */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <PaymentsCard paymentsData={paymentsData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalCustomersCard totalCustomers={totalCustomers} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <UserActivityCard activityPercentage={activityPercentage} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                  <Stack spacing={1}>
                    <Typography color="text.secondary" variant="overline">
                      Total Profit
                    </Typography>
                    <Typography variant="h4">$0k</Typography>
                  </Stack>
                  <Avatar sx={{ backgroundColor: 'error.main', height: 56, width: 56 }}>
                    <CurrencyDollarIcon fontSize={32} />
                  </Avatar>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle row: User Activity Trend chart and Traffic donut */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <UserActivityTrendCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TrafficCard />
        </Grid>
      </Grid>

      {/* Bottom row: Registered Users and Audio Files */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <RegisteredUsersCard users={users} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AudioCard audioFiles={audioFiles} />
        </Grid>
      </Grid>
    </Stack>
  );
}
