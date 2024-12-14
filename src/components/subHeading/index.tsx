import React from 'react'

const Subheading = () => {
    return (
        <div className='w-full h-[303px] flex items-end'>
            <img src="../images/image 3.svg" alt="foto" className='absolute ms-[100px]' />
            <div className="w-full h-[252px] bg-custom-purple-2-100 flex justify-end">
                <div className="w-[640px] text-white mt-[35px] me-[100px]">
                    <h1 className=' text-[28px] text-center'>Jangan Lewatkan Kesempatan Spesial Ini!</h1>
                    <p className='text-[18px] font-sans mt-5'>Bergabunglah dengan kami untuk sebuah event yang penuh inspirasi dan keseruan. Daftarkan dirimu sekarang dan jadilah bagian dari momen berharga ini!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Subheading