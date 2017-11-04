import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import styles from './index.styl';

class TableCell extends Component {
    static propTypes = {
        column: PropTypes.object,
        record: PropTypes.object,
        cellWidth: PropTypes.number
    };

    static defaultProps = {
        column: {},
        record: {},
        cellWidth: 0
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (typeof nextProps.column.render === 'function')
            ||
            nextProps.column !== this.props.column
            ||
            nextProps.record !== this.props.record
        );
    }

    render() {
        const { column, record, cellWidth } = this.props;
        const render = column.render;
        // dataKey is an alias for dataIndex
        const dataKey = (typeof column.dataKey !== 'undefined') ? column.dataKey : column.dataIndex;
        const text = get(record, dataKey);

        return (
            <div
                className={classNames(
                    styles.td,
                    column.className,
                    column.cellClassName
                )}
                style={{
                    ...column.style,
                    ...column.cellStyle,
                    minWidth: cellWidth
                }}
            >
                <div className={styles.tdContent}>
                    {typeof render === 'function' ? render(text, record) : text}
                </div>
            </div>
        );
    }
}

export default TableCell;
