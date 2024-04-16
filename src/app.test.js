import {jest, test, expect, beforeEach, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope
import app from './app.js';
import request from 'supertest';

describe('avatar api', () => {

    const TEST_DATA = {
        "avatarName": "Mark",
        "childAge": 12,
        "skinColor": "#0000ff",
        "hairstyle": "short",
        "headShape": "oval",
        "upperClothing": "jacket",
        "lowerClothing": "shorts"
    }

    test('create avatar', async () => {
        const createResponse = await request(app)
            .post('/api/avatars')
            .send(TEST_DATA)
            .set('Accept', 'application/json')
            .expect(201);

        expect(createResponse.body).toMatchObject(TEST_DATA);
        expect(createResponse.body.id).toBeGreaterThan(0);
        expect(createResponse.body.createdAt).toBeDefined();

        const getOneResponse = await request(app)
            .get(`/api/avatars/${createResponse.body.id}`)
            .set('Accept', 'application/json')
            .expect(200);

        // expect on response2
    });


});

