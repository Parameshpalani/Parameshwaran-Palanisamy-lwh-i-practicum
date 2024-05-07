const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "";

app.get('/contacts', async (req, res) => {

    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

});

app.get('/update', async (req, res) => {
    // http://localhost:3000/update?Name=HP
    const Name = req.query.name;

    const getContact = `https://api.hubapi.com/crm/v3/objects/Laptops/$Name?idProperty=Name&properties=Name,Price`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;

        // res.json(data);
        res.render('update', {userEmail: data.properties.email, favoriteBook: data.properties.favorite_book});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "Price": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/Laptops`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));
