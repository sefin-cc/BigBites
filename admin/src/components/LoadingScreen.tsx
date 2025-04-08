
import ReactLoading from 'react-loading';

export const LoadingScreen = () =>{
    return(
        <div className='w-full h-screen flex justify-center items-center p-28 absolute'style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 }} >
            <ReactLoading type={'bubbles'} color={'#FFEEE5'} height={'9%'} width={'9%'} />
        </div>  
    );
}