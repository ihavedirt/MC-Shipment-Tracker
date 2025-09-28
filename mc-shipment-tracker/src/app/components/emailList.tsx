'use client'

import { List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import * as React from 'react';


type EmailListProps = {
    emails: string[];
    onDelete?: (email: string) => void;
}

export default function EmailList({emails, onDelete}: EmailListProps) {

    return (
        <div>
            <List dense={true}>
              {emails.map((email, index) =>
                <ListItem key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete?.(email)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={email}
                    secondary={true ? 'Secondary text' : null}
                  />
                </ListItem>,
              )}
            </List>
        </div>
    );
}