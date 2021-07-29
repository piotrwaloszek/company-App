const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {

    before(async () => {

        try {
          const fakeDB = new MongoMemoryServer();
          await fakeDB.start();
      
          const uri = await fakeDB.getUri();
      
          mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
        } catch(err) {
          console.log(err);
        }
      
    });

    describe('Reading data', () => {

        before(async () => {
            const testEmpOne = new Employee({
                firstName: 'Jan',
                lastName: 'Nowak',
                department: 'IT'
            });
            await testEmpOne.save();
        
            const testEmpTwo = new Employee({
                firstName: 'Anna',
                lastName: 'Kowalska',
                department: 'HR'
            });
            await testEmpTwo.save();
        });
    
        it('should return all the data with "find" method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees.length).to.be.equal(expectedLength);
        });
    
        it('should return a proper document by "name" with "findOne" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Jan' });
            const expectedName = 'Nowak';
            expect(employee.lastName).to.be.equal(expectedName);
        });
    
        after(async () => {
            await Employee.deleteMany();
        });
        
    });

    describe('Creating data', () => {

        it('should insert new document with "insertOne" method', async () => {
            const employee = new Employee({
                firstName: 'Krystian',
                lastName: 'Testowy',
                department: 'Marketing'
            });
            await employee.save();
            expect(employee.isNew).to.be.false;
        });

        after(async () => {
            await Employee.deleteMany();
        });
      
    });

    describe('Updating data', () => {

        beforeEach(async () => {
            const testEmpOne = new Employee({
                firstName: 'Jan',
                lastName: 'Nowak',
                department: 'IT'
            });
            await testEmpOne.save();
        
            const testEmpTwo = new Employee({
                firstName: 'Anna',
                lastName: 'Kowalska',
                department: 'HR'
            });
            await testEmpTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({ firstName: 'Jan' }, { $set: { firstName: '=Jan=' }});
            const updatedEmployee = await Employee.findOne({ firstName: '=Jan=' });
            expect(updatedEmployee).to.not.be.null;
        });
      
        it('should properly update one document with "save" method', async () => {
            const employee = await Employee.findOne({firstName: 'Jan'});
            employee.firstName = '=Jan=';
            await employee.save();

            const updatedEmployee = await Employee.findOne({firstName: '=Jan='});
            expect(updatedEmployee).to.not.be.null;
        });
      
        it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.updateMany({}, {$set: {firstName: '=Jan='}});
            const updatedEmployee = await Employee.find({firstName: '=Jan='});
            expect(updatedEmployee.length).to.be.equal(2);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Removing data', () => {

        beforeEach(async () => {
            const testEmpOne = new Employee({
                firstName: 'Jan',
                lastName: 'Nowak',
                department: 'IT'
            });
            await testEmpOne.save();
        
            const testEmpTwo = new Employee({
                firstName: 'Anna',
                lastName: 'Kowalska',
                department: 'HR'
            });
            await testEmpTwo.save();
        });

        it('should properly remove one document with "deleteOne" method', async () => {
            await Employee.deleteOne({firstName: 'Jan'});
            const deleted = await Employee.findOne({firstName: 'Jan'});
            expect(deleted).to.be.null;
        });
      
        it('should properly remove one document with "remove" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Jan' });
            await employee.remove();
            const removedEmployee = await Employee.findOne({ firstName: 'Jan' });
            expect(removedEmployee).to.be.null;
        });
      
        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });
      
    });

});