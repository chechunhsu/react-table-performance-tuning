import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableCell from './TableCell';

export default ({
    columns,
    currentHoverKey,
    hoverKey,
    record,
    index,
    rowClassName,
    cellWidths,
    onRowClick
} = {
  record: {},
  rowClassName: _ => '',
  cellWidths: []
}) => {
  const handleRowClick = e => {
      onRowClick(record, index, e);
  };
  const className = rowClassName(record, hoverKey);

  return (
      <div
        key={hoverKey}
        className={classNames(
            styles.tr,
            className,
            { [styles['tr-hover']]: (currentHoverKey === hoverKey) }
        )}
        onClick={handleRowClick}>
        { columns.map(renderCell(cellWidths, record)) }
      </div>
  );
};

const renderCell = (cellWidths, record) => (column, index) => {
    const render = column.render;
    const text = record && record[column.dataKey || column.dataIndex];

    return (
        <div key={index} className={styles.td} style={{ minWidth: cellWidths[index] }}>
            <div className={styles.tdContent}>
                {typeof render === 'function' ? render(text, record) : text}
            </div>
        </div>
    );
};
