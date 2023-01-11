import express from 'express';
import { requireAuth } from '@mohamedl3zb-ticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', requireAuth,async(req,res) =>{
    res.send({currentUser:req.currentUser || null});
})


export {router as currentUserRouter}