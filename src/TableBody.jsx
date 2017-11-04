import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableRow from './TableRow';

const CELL_HEIGHT = 37;
const HEADER_HEIGHT = 38;

class TableBody extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        emptyText: PropTypes.func,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        records: PropTypes.array,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number,
        cellWidths: PropTypes.array
    };

    static defaultProps = {
        emptyText: () => {
            return 'No Data';
        },
        onMouseOver: () => {},
        onTouchStart: () => {},
        onScroll: () => {},
        records: [],
        rowKey: 'key'
    };

    constructor(props) {
        super(props);

        this.state = {
            startIndex: 0,
            endIndex: 9
        };
    }

    handleScroll = e => {
        const bodyHeight = e.target.clientHeight;
        const scrollTop = e.target.scrollTop;
        const startIndex = Math.floor(scrollTop / CELL_HEIGHT) - 1;
        const endIndex = startIndex + Math.ceil(bodyHeight / CELL_HEIGHT);

        this.setState(_ => ({ startIndex, endIndex}));
    };

    componentDidMount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        this.body.parentNode.addEventListener('scroll', this.handleScroll);
        this.body.addEventListener('mouseover', onMouseOver);
        this.body.addEventListener('touchstart', onTouchStart);
    }
    componentWillUnmount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        this.body.parentNode.removeEventListener('scroll', this.handleScroll);
        this.body.removeEventListener('mouseover', onMouseOver);
        this.body.removeEventListener('touchstart', onTouchStart);
    }

    // componentDidUpdate(prevProps, prevState) {
    //     const { scrollTop } = this.props;
    //     if (this.body.scrollTop !== scrollTop) {
    //         this.body.scrollTop = scrollTop;
    //     }
    // }

    getRowKey (record, index) {
        const rowKey = this.props.rowKey;
        let key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);
        return key === undefined ? `table_row_${index}` : key;
    }

    render() {
        const {
            columns,
            currentHoverKey,
            expandedRowKeys,
            expandedRowRender,
            emptyText,
            onRowHover,
            onRowClick,
            records,
            rowClassName,
            cellWidths
        } = this.props;
        const { startIndex, endIndex } = this.state;
        const startHeight = startIndex * CELL_HEIGHT;
        const endHeight = (records.length - endIndex) * CELL_HEIGHT;

        const noData = (!records || records.length === 0);

        return (
            <div
                className={styles.tbody}
                ref={node => {
                    this.body = node;
                }}
            >
                <div style={{ height: startHeight }}/>
                {
                    records.filter((row, index) => index >= startIndex && index <= endIndex).map((row, index) => {
                        const key = this.getRowKey(row, index);
                        return (
                            <TableRow
                                columns={columns}
                                currentHoverKey={currentHoverKey}
                                // expandedRowKeys={expandedRowKeys}
                                // expandedRowRender={expandedRowRender}
                                hoverKey={key}
                                index={index}
                                key={key}
                                // onHover={onRowHover}
                                onRowClick={onRowClick}
                                record={row}
                                rowClassName={rowClassName}
                                cellWidths={cellWidths}
                            />
                        );
                    })
                }
                {/* {
                    noData &&
                    <div className={styles.tablePlaceholder}>
                        { emptyText() }
                    </div>
                } */}
                <div style={{ height: endHeight }}/>
            </div>
        );
    }
}

export default TableBody;
