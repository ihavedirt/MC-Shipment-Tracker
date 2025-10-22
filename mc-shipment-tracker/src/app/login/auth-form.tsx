'use client'

import { useState } from 'react';
import { Button, TextField, Card } from '@mui/material';
import { login, signup } from './actions';

export default function AuthForm() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div style={{ maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', padding: '20px'}}>
            <Card style={{ padding: '30px' }}>
                <h2 style={{color: 'gray'}}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                <form>
                    <TextField
                        name="email"
                        type="email"
                        placeholder="Email"
                        variant="outlined" 
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                    <TextField
                        name="password"
                        type="password"
                        placeholder="Password"
                        variant="outlined" 
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                    {isSignUp ? <>
                        <div>
                            <TextField 
                                name="first_name"
                                placeholder="First Name"
                                variant="outlined" 
                                style={{ width: '50%', padding: '8px', marginBottom: '10px' }}
                                required
                            />
                            <TextField 
                                name="last_name"
                                placeholder="Last Name"
                                variant="outlined" 
                                style={{ width: '50%', padding: '8px', marginBottom: '10px' }}
                                required
                            />
                        </div>
                        <TextField 
                            name="phone"
                            placeholder="Phone Number"
                            variant="outlined" 
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            required
                        />
                    </> : <></>}
                    <Button 
                        variant='contained' 
                        type="submit" 
                        formAction={isSignUp ? signup : login}
                        style={{ width: '90%', padding: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                </form>
                <Button 
                    onClick={() => setIsSignUp(!isSignUp)} 
                    style={{ marginTop: '10px' }}
                >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
            </Card>
        </div>
    );
}