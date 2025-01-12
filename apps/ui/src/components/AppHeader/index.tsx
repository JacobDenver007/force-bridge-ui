import { MenuOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { NetworkDirectionSelector } from './NetworkDirectionSelector';
import LogoImage from './logo.svg';

const AppHeaderWrapper = styled.header`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  padding: 16px 100px;
  height: 64px;
`;

const Logo = styled.img`
  height: 32px;
`;

export const AppHeader: React.FC = () => {
  const referenceLinks = (
    <Menu>
      <Menu.Item>
        <a href="https://github.com/nervosnetwork/force-bridge" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <AppHeaderWrapper>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col span={3}>
          <Logo src={LogoImage} alt="logo" />
        </Col>
        <Col span={18} style={{ textAlign: 'center' }}>
          <NetworkDirectionSelector
            directions={[
              { from: 'Ethereum', to: 'Nervos' },
              { from: 'Nervos', to: 'Ethereum' },
            ]}
          />
        </Col>
        <Col span={3} style={{ textAlign: 'right' }}>
          <Dropdown overlay={referenceLinks}>
            <Button type="primary" icon={<MenuOutlined />} size="small" />
          </Dropdown>
        </Col>
      </Row>
    </AppHeaderWrapper>
  );
};
