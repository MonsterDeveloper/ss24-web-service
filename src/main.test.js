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
            .auth('marie@home.edu', '123')
            .send(TEST_DATA)
            .set('Accept', 'application/json')
            .expect(201);

        expect(createResponse.body).toMatchObject(TEST_DATA);
        expect(createResponse.body.id).toBeDefined();
        expect(createResponse.body.createdAt).toBeDefined();

        const newAvatarId = createResponse.body.id;

        const getOneResponse = await request(app)
            .get(`/api/avatars/${newAvatarId}`)
            .set('Accept', 'application/json')
            .auth('marie@home.edu', '123')
            .expect(200);

        expect(getOneResponse.body).toMatchObject(TEST_DATA);
    });

    test('get all', async () => {

        const getAllResponse = await request(app)
            .get(`/api/avatars`)
            .auth('marie@home.edu', '123')
            .set('Accept', 'application/json')
            .expect(200);

        const createResponse = await request(app)
            .post('/api/avatars')
            .auth('marie@home.edu', '123')
            .send(TEST_DATA)
            .set('Accept', 'application/json')
            .expect(201);

        const newAvatarId = createResponse.body.id;

        const getAllWithNewResponse = await request(app)
            .get(`/api/avatars`)
            .auth('marie@home.edu', '123')
            .set('Accept', 'application/json')
            .expect(200);

        expect(getAllResponse.body.length + 1).toEqual(getAllWithNewResponse.body.length)
        expect(getAllWithNewResponse.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: newAvatarId
                })
            ])
        );
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
            .auth('marie@home.edu', '123')
            .send(testData)
            .set('Accept', 'application/json')
            .expect(400);

        expect(createResponse.body.error).toBe('"avatarName" is required');

        const createResponse2 = await request(app)
            .post('/api/avatars')
            .auth('marie@home.edu', '123')
            .send({ "avatarName": "Mark" })
            .set('Accept', 'application/json')
            .expect(400);

        expect(createResponse2.body.error).toBe('"childAge" is required');
    });

    test("create user", async () => {
        const createUserResponse = await request(app)
            .post('/api/users')
            .send({
                "userName": "test",
                "password": "123",
                "roles": ["parent"]
            })
            .auth('marie@home.edu', '123')
            .set('Accept', 'application/json')
            .expect(201);

        expect(createUserResponse.body).toMatchObject({
            "userName": "test",
            "roles": ["parent"]
        });
        expect(createUserResponse.body.id).toBeDefined();

    });
});

