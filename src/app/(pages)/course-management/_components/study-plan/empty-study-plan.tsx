
const EmptyStudyPlan = () => {
    return (
        <div className='w-full flex flex-col space-y-6 justify-center items-center'>
            <img src={"https://allpromoted.co.uk/image/no-data.svg"} height={400} width={400} alt='empty'></img>
            <div className='text-xl font-medium text-slate-400'>This Course does not have any study plans</div>
        </div>
    )
}

export default EmptyStudyPlan
