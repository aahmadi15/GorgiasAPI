import {config} from 'dotenv'
import path from 'path'
import url from 'url'
import express, { response } from 'express'
import axios from 'axios'

config({path: ".env"})

const port = process.env.PORT;

const API_KEY = `${process.env.PASSWORD_API_SECRET}`

const USER_NAME = `${process.env.USER_NAME}`

const app = express()

const ticketId = 38680891;

const bodyResponse = 'We are investigating this right now....'

const internalNote = 'This is an internal note for reference'

const scrambled = Buffer.from(`${USER_NAME}:${API_KEY}`).toString('base64');

async function addReplyAPI(ticketId, USER_NAME, bodyResponse, scrambled) {
    try{

        const url = `https://hotmail-1-2.gorgias.com/api/tickets/${ticketId}/messages/`;
        const options = {
            method: 'POST',
            url,
            headers: {
                'Authorization': `Basic ${scrambled}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                channel: 'api',
                from_agent: true,
                public: true,
                via: 'api',
                body_text: `${bodyResponse}`,
                sender: {
                    email: `${USER_NAME}`
                }
            }
        };
        const replay = await axios.request(options)
        console.log (replay)
    }

    catch (error) {
        handler(error)
    }
}

async function addInternalNoteAPI(ticketId, USER_NAME, bodyResponse, scrambled) {
    try{
        const url = `https://hotmail-1-2.gorgias.com/api/tickets/${ticketId}/messages/`;
        const options = {
            method: 'POST',
            url,
            headers: {
                'Authorization': `Basic ${scrambled}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                channel: 'api',
                from_agent: true,
                public: false,
                via: 'api',
                body_text: `${bodyResponse}`,
                sender: {
                    email: `${USER_NAME}`
                }
            }
        };
        const replay = await axios.request(options)
        console.log (replay)
    }

    catch (error) {
        handler(error)
    }
}

addReplyAPI(ticketId, USER_NAME, bodyResponse, scrambled);
addInternalNoteAPI(ticketId, USER_NAME, bodyResponse, scrambled)

function handler(error) {
    if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
    } else if (error.request) {
        console.error('No response received:', error.request);
    } else {
        console.error('Error:', error.message);
    }
}

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});

