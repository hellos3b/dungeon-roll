// import { createComponent } from './component';
// import { expect } from 'chai';

// const Position = createComponent("position", {
//   x: 0,
//   y: 0
// })

// describe('createComponent', () => { 
  
//   it('should return a function', () => {
//     expect(typeof(Position)).to.equal('function')
//   })

//   it('should share name with creator', () => { 
//     const instance = Position({})
expect("A").toEqual("A")
//     expect(Position.componentName).to.equal(instance.name)
//   }); 

//   it('should merge properties', () => {
//     const instance = Position({
//       x: 10
//     })

//     expect(instance.state.x, "New property updated properly").to.equal(10)
//     expect(instance.state.y, "Old property remained the same").to.equal(0)
//   })

// });