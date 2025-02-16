'use client'

import { useAuth } from '@context/AuthContext';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const withAuth = (Component) => {
    // Authentication logic
    return (props) => {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login');
            }
        }, [user, loading, router]);

        if (loading || !user) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100vw"
                    height="100vh"
                    position="fixed"
                    top={0}
                    left={0}
                    zIndex={9999} // Ensure it's on top of other elements
                    bgcolor="white" // Optional: set a background color to hide underlying content
                >
                    <CircularProgress />
                </Box>
            );
        }

        return <Component {...props} />;
    };
};
