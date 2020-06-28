
const fn = function ( param1, param2 ) {
    console.log( param1);
    console.log(param2 );
}
 


const newFn = fn.bind( this, 'param1Fixed' );
 
//fn( 'Hello', 'World' ); 
newFn( 'Goodbye', 'Lenin' ); 