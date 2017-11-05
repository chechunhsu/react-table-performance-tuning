import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableRow from './TableRow';

const CELL_HEIGHT = 37;
const HEADER_HEIGHT = 38;

const between = (value, A, B) => value >= A && value <= B;

export default class TableBody extends PureComponent {
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
        const scrollBottom = scrollTop + bodyHeight;
        const startIndex = Math.floor((scrollTop - HEADER_HEIGHT) / CELL_HEIGHT);
        const endIndex = Math.ceil(scrollBottom / CELL_HEIGHT);

        this.setState(_ => ({ startIndex, endIndex }));
    };

    componentDidMount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        this.body.parentNode.addEventListener('scroll', this.handleScroll);
        // this.body.addEventListener('mouseover', onMouseOver);
        // this.body.addEventListener('touchstart', onTouchStart);
    }

    componentWillUnmount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        this.body.parentNode.removeEventListener('scroll', this.handleScroll);
        // this.body.removeEventListener('mouseover', onMouseOver);
        // this.body.removeEventListener('touchstart', onTouchStart);
    }

    getRowKey (record, index) {
        const rowKey = this.props.rowKey;
        const key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);

        return key || `table_row_${index}`;
    }

    render() {
        const {
            columns,
            currentHoverKey,
            expandedRowKeys,
            expandedRowRender,
            onRowHover,
            onRowClick,
            records,
            rowClassName,
            cellWidths
        } = this.props;
        const startIndex = Math.max(this.state.startIndex, 0);
        const endIndex = Math.min(this.state.endIndex, records.length);
        const startHeight = startIndex * CELL_HEIGHT;
        const endHeight = (records.length - endIndex) * CELL_HEIGHT;

        return (
            <div className={styles.tbody} ref={node => { this.body = node; }}>
                <div style={{ height: startHeight }}/>
                { records
                    .filter((row, index) => between(index, startIndex, endIndex))
                    .map((row, index) =>
                        TableRow({
                          columns,
                          currentHoverKey,
                          hoverKey: this.getRowKey(row, index),
                          index,
                          onRowClick,
                          record: row,
                          rowClassName,
                          cellWidths
                        })
                    )
                }
                <div style={{ height: endHeight }}/>
            </div>
        );
    }
}
