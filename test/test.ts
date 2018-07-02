import { expect } from 'chai'
import { describe } from 'mocha'
import App from "../web/server"
import Axios from 'axios'
import { Server } from 'http'

let server: Server
const URL: string = 'http://localhost:8888'
let token: string

describe('api', function() {
	// let server = null
	before(function() {
		process.env.TEST = 'true'
		const port: number = 8888

    try {
      server = App.listen(port)
    } catch (e) {
      console.error(e)
    }
	})

  after(function () {
    server.close(() => {
      console.log('stopping')
    })
  })

	// For the home routes.
	describe('Home', function () {

		// Test the landing page renders
		describe('Render', function () {
			it("Should return the home page from '/'", function(done) {
				Axios.get('http://127.0.0.1:8888/').then((response) => {
          expect(response.status).to.equal(200)
          done()
        })
			})
		})
	})

  describe('Auth', function () {
    describe('Register', function () {
      it("Should register a user and return a token", function(done) {
        const userData = {
          username: 'tester',
          password: 'secret'
        }
        Axios.post(`${URL}/api/auth/register`, userData).then((response) => {
          expect(response.data.payload.token).to.have.length.above(10)
          done()
        })
      })
    })

    describe('Authenticate', function () {
      it("Should return a JWT token", function (done) {
        const userData = {
          username: 'tester',
          password: 'secret'
        }
        Axios.post(`${URL}/api/auth/authenticate`, userData).then((response) => {
          expect(response.data.payload.token).to.have.length.above(10)
          token = response.data.payload.token
          done()
        })
      })
    })
  })

  describe ('User', function () {
    describe('Profile', function () {
      it('Should return the users information', function (done) {
        Axios.get(`${URL}/api/user/me`, {headers: {'x-access-token': token}}).then((response) => {
          expect(response.data.payload.user.username).to.equal('tester')
          done()
        })
      })
    })

    describe('Destroy', function () {
      it('Should delete users profile', function (done) {
        Axios.delete(`${URL}/api/user/destroy`, {headers: {'x-access-token': token}}).then((response) => {
          expect(response.status).to.equal(200)
          done()
        })
      })
    })
  })
})
