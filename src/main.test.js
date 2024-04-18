import { test, expect, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope
import app from './main.js';
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

        expect(getOneResponse.body).toMatchObject(TEST_DATA);
        expect(getOneResponse.body.id).toBe(createResponse.body.id);
        expect(getOneResponse.body.createdAt).toBe(createResponse.body.createdAt);
    });


    test('create avatar requires at least avatar name and child age', async () => {

        const testData = {
            "skinColor": "#0000ff",
            "hairstyle": "short",
            "headShape": "oval",
            "upperClothing": "jacket",
            "lowerClothing": "shorts"
        }

        const createResponse = await request(app)
            .post('/api/avatars')
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);

        expect(createResponse.body.error).toBe('"avatarName" is required');

        const createResponse2 = await request(app)
            .post('/api/avatars')
            .send({ "avatarName": "Mark" })
            .set('Accept', 'application/json')
            .expect(400);

        expect(createResponse2.body.error).toBe('"childAge" is required');
    });
});

