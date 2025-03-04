
import OverviewModal from './overviewReport';
import BranchReportModal from './branchReportModal';
import BranchEarningModal from './branchEarnings';

export default function Reports() {

    return(
        <div className='flex flex-col items-center'>
            <p className="text-2xl p-4" style={{ fontFamily: "Madimi One" }}>GENERATE REPORTS</p>
            <div className="flex gap-4 justify-center">

                <OverviewModal />
                
                <BranchEarningModal />

                <BranchReportModal />


            </div>
        </div>
    );
}