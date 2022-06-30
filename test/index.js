const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const { fDateTimeSuffixShort } = require('../utils/formatTime')
// Assetion Styles
chai.should()
chai.expect()
//configure chai to use chai-http
chai.use(chaiHttp)

const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYXZpbmdzX2lkIjoxLCJpYXQiOjE2NTY2MTcyNTUsImV4cCI6MTY1NjYyNjg1NX0.LYzeAvkUalabCly1lRBF4KiABk014Reyq5iq95tPd5c'

describe('Registration and Authentication Testing', () => {

    /**
     * Tests
     * 1) Post only 1 field on registration
     * 2) Register and expect a statusCode of 201
     * 3) Login with a valid password expect status true on object
     * 4) Login with an invalid password - expect status a 401
     */



    describe('Register with an invalid payload', () => {
        it("It fails, as expected with status 400", (done) => {
            const payload = {
                name: "John Kiranga"
            }
            chai.request(app)
                .post('/members/register')
                .send(payload)
                .end((error, response) => {
                    expect(error).to.be.null;
                    response.should.have.status(400)
                    response.body.should.be.a('object')
                    expect(response.body.status).to.equal(false)
                })
            done()
        })
    })


    describe('Register with a valid payload', () => {
        it("It should return status 201", (done) => {
            const payload = {
                name: "Liam",
                username: "member",
                password: "1234"
            }
            chai.request(app)
                .post('/members/register')
                .send(payload)
                .end((error, response) => {
                    response.should.have.status(201)
                    response.body.should.be.a('object')
                    expect(response.body.status).to.equal(true)
                })

            done()
        })
    })


    describe('Login with a valid password', () => {
        it("It should return status 200", (done) => {
            const payload = {
                username: "etinx",
                password: "1234"
            }
            chai.request(app)
                .post('/members/authenticate')
                .send(payload)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    expect(response.body.status).to.equal(true)
                })

            done()
        })
    })

    describe('Login with a invalid password or username', () => {
        it("It should return status 401", (done) => {
            const payload = {
                username: "etinx",
                password: "12334"
            }
            chai.request(app)
                .post('/members/authenticate')
                .send(payload)
                .end((error, response) => {
                    response.should.have.status(401)
                })

            done()
        })
    })
})



describe('Actions on Savings Testing', () => {
    it('FAILS and ASKS for the token as expected', (done) => {
        const payload = {
            "amount": 100,
            "narration": "Savings Narration",
            "date": "2022-06-29"
        }
        chai.request(app)
            .post('/savings/save')
            .send(payload)
            .end((error, response) => {
                response.should.have.status(401)
                expect(response.body.message).to.equal("A token is required for authentication")
            })
        done();
    })

    it('FAILs to save,as expected beacuse of the date', (done) => {
        const payload = {
            "amount": 100,
            "narration": "Savings Narration",
            "date": "2022-06-29"
        }
        chai.request(app)
            .post('/savings/save').auth(access_token, { type: 'bearer' })
            .send(payload)
            .end((error, response) => {
                response.should.have.status(409)
                expect(response.body.message).to.equal("You can`t save for the past days.")
            })

        done();
    })

    it('SUCCESSFUL saving,expect 201 as status', (done) => {
        const payload = {
            "amount": 1000,
            "narration": "Savings Narration",
            "date": fDateTimeSuffixShort(new Date())
        }
        chai.request(app)
            .post('/savings/save').auth(access_token, { type: 'bearer' })
            .send(payload)
            .end((error, response) => {
                console.log(response.body);
                response.should.have.status(201)
            })

        done();
    })
})
