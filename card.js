import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardComponent(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent sx={{display:"flex", gap:"10%"}}>
        <div>
        <h4>time</h4>
        <Typography gutterBottom variant="h5" component="div">
          {props.times}
        </Typography>
        </div>
        <div>
        <h4>work</h4>
        <Typography variant="body2" color="text.secondary">
          {props.works}
        </Typography>
        </div>
       
      </CardContent>
      <CardActions>
        {props.children}
      </CardActions>
    </Card>
  );
}
