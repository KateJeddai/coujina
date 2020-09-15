import React, {useState} from 'react';
import '../styles/AppPagination.scss';

const AppPagination = (props) => {
    const { numberOfPages } = props;
    const [num, setNum] = useState(1);
    const pages = [];

    for(var i = 1; i <= numberOfPages; i++) {
        pages.push(i);
    }

    const handlePageChange = (e) => {
        if(e.target.innerText !== num) {
            setNum(+e.target.innerText);
            props.handlePageChange(e.target.innerText);
        }
    }

    return (
        <div className="pagination-wrapper">
            {pages.length > 1 ? pages.map((p => {
                return (
                 <div className={num === p ? "page-num active" : "page-num"} 
                      key={p}
                      onClick={handlePageChange}>{p}</div>
                )
            })) : null}
        </div>
    )
}

export default AppPagination;
