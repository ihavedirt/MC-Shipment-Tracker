'use client'

import { useState, FormEvent } from 'react';
import { Button, TextField, Card } from '@mui/material';
import { supabase } from '../../../utils/supabase/client';

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSignUp) {
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) {
                console.error('Error signing up:', signUpError.message);
                return;
            }
        }
        else {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
                console.error('Error signing in:', signInError.message);
                return;
            }
        }
    };

    return (
        <div style={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', padding: '20px'}}>
            <Card>
                <h2 style={{color: 'blue'}}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                <form onSubmit={handleAuth}>
                    <TextField
                        type="email"
                        placeholder="Email"
                        variant="outlined" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <TextField
                        type="password"
                        placeholder="Password"
                        variant="outlined" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    {isSignUp ? <>
                        <TextField 
                            placeholder="First Name"
                            variant="outlined" 
                            style={{ width: '50%', padding: '8px', marginBottom: '10px' }}
                        />
                        <TextField 
                            placeholder="Last Name"
                            variant="outlined" 
                            style={{ width: '50%', padding: '8px', marginBottom: '10px' }}
                        />
                        <TextField 
                            placeholder="Phone Number"
                            variant="outlined" 
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </> : <></>}
                    <Button type="submit" style={{ width: '100%', padding: '10px' }}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                </form>
                <Button onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: '10px' }}>
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
            </Card>
        </div>
    );
}