const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Department', () => {

    it('should throw an error if no "name" arg', () => {
        const dep = new Department({}); // create new Department, but don't set `name` attr value
      
        dep.validate(err => {
          expect(err.errors.name).to.exist;
        });
      });
      it('should throw an error if "name" is not a string', () => {
        const cases = [{}, []];
        for(let name of cases) {
          const dep = new Department({ name });
      
          dep.validate(err => {
            expect(err.errors.name).to.exist;
          });
        }
      });
      it('should throw an error if "name" is longer than 50 and shorter than 2 characters', () => {
        const cases = ['c', 'A', 'Lorem Ipsum Lorem Lorem.... Lorem Ipsum Lorem Lorem....'];
        for(let name of cases){
          const dep = new Department({name})
          dep.validate(err => {
            expect(err.errors.name).to.exist;
          });
        }
      });
      it('should not throw an error if "name" is okay', () => {
        const cases = ['Management', 'Human Resources'];
        for(let name of cases) {
          const dep = new Department({ name });
      
          dep.validate(err => {
            expect(err).to.not.exist;
          });
        }
      });

      after(() => {
        mongoose.models = {};
    });
});