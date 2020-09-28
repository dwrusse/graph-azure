import {
  IntegrationExecutionContext,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';

import {
  STEP_AD_ACCOUNT,
  STEP_AD_GROUP_MEMBERS,
  STEP_AD_GROUPS,
  STEP_AD_USERS,
  STEP_AD_SERVICE_PRINCIPALS,
} from './steps/active-directory';
import {
  STEP_RM_AUTHORIZATION_ROLE_ASSIGNMENTS,
  STEP_RM_AUTHORIZATION_CLASSIC_ADMINISTRATORS,
  STEP_RM_AUTHORIZATION_ROLE_ASSIGNMENT_PRINCIPAL_RELATIONSHIPS,
  STEP_RM_AUTHORIZATION_ROLE_DEFINITIONS,
  STEP_RM_AUTHORIZATION_ROLE_ASSIGNMENT_SCOPE_RELATIONSHIPS,
} from './steps/resource-manager/authorization';
import {
  STEP_RM_COMPUTE_VIRTUAL_MACHINE_DISKS,
  STEP_RM_COMPUTE_VIRTUAL_MACHINE_IMAGES,
  STEP_RM_COMPUTE_VIRTUAL_MACHINES,
} from './steps/resource-manager/compute';
import { STEP_RM_COSMOSDB_SQL_DATABASES } from './steps/resource-manager/cosmosdb';
import {
  STEP_RM_DATABASE_MARIADB_DATABASES,
  STEP_RM_DATABASE_MYSQL_DATABASES,
  STEP_RM_DATABASE_POSTGRESQL_DATABASES,
  STEP_RM_DATABASE_SQL_DATABASES,
} from './steps/resource-manager/databases';
import { STEP_RM_COMPUTE_NETWORK_RELATIONSHIPS } from './steps/resource-manager/interservice/constants';
import { STEP_RM_KEYVAULT_VAULTS } from './steps/resource-manager/key-vault';
import {
  STEP_RM_NETWORK_INTERFACES,
  STEP_RM_NETWORK_LOAD_BALANCERS,
  STEP_RM_NETWORK_PUBLIC_IP_ADDRESSES,
  STEP_RM_NETWORK_SECURITY_GROUP_RULE_RELATIONSHIPS,
  STEP_RM_NETWORK_SECURITY_GROUPS,
  STEP_RM_NETWORK_VIRTUAL_NETWORKS,
} from './steps/resource-manager/network';
import {
  STEP_RM_STORAGE_RESOURCES,
  STEP_RM_STORAGE_QUEUES,
  STEP_RM_STORAGE_TABLES,
} from './steps/resource-manager/storage';
import { IntegrationConfig } from './types';
import { STEP_RM_RESOURCES_RESOURCE_GROUPS } from './steps/resource-manager/resources';
import { STEP_RM_SUBSCRIPTIONS } from './steps/resource-manager/subscriptions';
import {
  STEP_RM_API_MANAGEMENT_APIS,
  STEP_RM_API_MANAGEMENT_SERVICES,
} from './steps/resource-manager/api-management';
import {
  STEP_RM_DNS_ZONES,
  STEP_RM_DNS_RECORD_SETS,
} from './steps/resource-manager/dns';
import {
  STEP_RM_PRIVATE_DNS_ZONES,
  STEP_RM_PRIVATE_DNS_RECORD_SETS,
} from './steps/resource-manager/private-dns';
import {
  STEP_RM_CONTAINER_REGISTRIES,
  STEP_RM_CONTAINER_REGISTRY_WEBHOOKS,
} from './steps/resource-manager/container-registry';
import {
  STEP_RM_SERVICE_BUS_NAMESPACES,
  STEP_RM_SERVICE_BUS_QUEUES,
  STEP_RM_SERVICE_BUS_TOPICS,
  STEP_RM_SERVICE_BUS_SUBSCRIPTIONS,
} from './steps/resource-manager/service-bus';
import {
  STEP_RM_CDN_PROFILE,
  STEP_RM_CDN_ENDPOINTS,
} from './steps/resource-manager/cdn';
import {
  STEP_RM_BATCH_ACCOUNT,
  STEP_RM_BATCH_POOL,
  STEP_RM_BATCH_APPLICATION,
  STEP_RM_BATCH_CERTIFICATE,
} from './steps/resource-manager/batch';
import {
  STEP_RM_EVENT_GRID_DOMAINS,
  STEP_RM_EVENT_GRID_DOMAIN_TOPICS,
  STEP_RM_EVENT_GRID_DOMAIN_TOPIC_SUBSCRIPTIONS,
  STEP_RM_EVENT_GRID_TOPICS,
  STEP_RM_EVENT_GRID_TOPIC_SUBSCRIPTIONS,
} from './steps/resource-manager/event-grid';
import { hasSubscriptionId } from '.';

export default function getStepStartStates(
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
): StepStartStates {
  const config = executionContext.instance.config || {};

  const activeDirectory = { disabled: !config.ingestActiveDirectory };
  const resourceManager = { disabled: !hasSubscriptionId(config) };

  return {
    [STEP_AD_ACCOUNT]: { disabled: false },
    [STEP_AD_GROUPS]: activeDirectory,
    [STEP_AD_GROUP_MEMBERS]: activeDirectory,
    [STEP_AD_USERS]: activeDirectory,
    [STEP_AD_SERVICE_PRINCIPALS]: activeDirectory,
    [STEP_RM_KEYVAULT_VAULTS]: resourceManager,
    [STEP_RM_NETWORK_VIRTUAL_NETWORKS]: resourceManager,
    [STEP_RM_NETWORK_SECURITY_GROUPS]: resourceManager,
    [STEP_RM_NETWORK_SECURITY_GROUP_RULE_RELATIONSHIPS]: resourceManager,
    [STEP_RM_NETWORK_INTERFACES]: resourceManager,
    [STEP_RM_NETWORK_PUBLIC_IP_ADDRESSES]: resourceManager,
    [STEP_RM_NETWORK_LOAD_BALANCERS]: resourceManager,
    [STEP_RM_COMPUTE_VIRTUAL_MACHINE_IMAGES]: resourceManager,
    [STEP_RM_COMPUTE_VIRTUAL_MACHINE_DISKS]: resourceManager,
    [STEP_RM_COMPUTE_VIRTUAL_MACHINES]: resourceManager,
    [STEP_RM_COSMOSDB_SQL_DATABASES]: resourceManager,
    [STEP_RM_DATABASE_MARIADB_DATABASES]: resourceManager,
    [STEP_RM_DATABASE_MYSQL_DATABASES]: resourceManager,
    [STEP_RM_DATABASE_POSTGRESQL_DATABASES]: resourceManager,
    [STEP_RM_DATABASE_SQL_DATABASES]: resourceManager,
    [STEP_RM_STORAGE_RESOURCES]: resourceManager,
    [STEP_RM_STORAGE_QUEUES]: resourceManager,
    [STEP_RM_STORAGE_TABLES]: resourceManager,
    [STEP_RM_COMPUTE_NETWORK_RELATIONSHIPS]: resourceManager,
    [STEP_RM_AUTHORIZATION_ROLE_ASSIGNMENTS]: resourceManager,
    [STEP_RM_AUTHORIZATION_ROLE_ASSIGNMENT_PRINCIPAL_RELATIONSHIPS]: resourceManager,
    [STEP_RM_AUTHORIZATION_ROLE_ASSIGNMENT_SCOPE_RELATIONSHIPS]: resourceManager,
    [STEP_RM_AUTHORIZATION_ROLE_DEFINITIONS]: resourceManager,
    [STEP_RM_AUTHORIZATION_CLASSIC_ADMINISTRATORS]: resourceManager,
    [STEP_RM_RESOURCES_RESOURCE_GROUPS]: resourceManager,
    [STEP_RM_SUBSCRIPTIONS]: resourceManager,
    [STEP_RM_API_MANAGEMENT_SERVICES]: resourceManager,
    [STEP_RM_API_MANAGEMENT_APIS]: resourceManager,
    [STEP_RM_DNS_ZONES]: resourceManager,
    [STEP_RM_DNS_RECORD_SETS]: resourceManager,
    [STEP_RM_PRIVATE_DNS_ZONES]: resourceManager,
    [STEP_RM_PRIVATE_DNS_RECORD_SETS]: resourceManager,
    [STEP_RM_CONTAINER_REGISTRIES]: resourceManager,
    [STEP_RM_CONTAINER_REGISTRY_WEBHOOKS]: resourceManager,
    [STEP_RM_SERVICE_BUS_NAMESPACES]: resourceManager,
    [STEP_RM_SERVICE_BUS_QUEUES]: resourceManager,
    [STEP_RM_SERVICE_BUS_TOPICS]: resourceManager,
    [STEP_RM_SERVICE_BUS_SUBSCRIPTIONS]: resourceManager,
    [STEP_RM_CDN_PROFILE]: resourceManager,
    [STEP_RM_CDN_ENDPOINTS]: resourceManager,
    [STEP_RM_BATCH_ACCOUNT]: resourceManager,
    [STEP_RM_BATCH_POOL]: resourceManager,
    [STEP_RM_BATCH_APPLICATION]: resourceManager,
    [STEP_RM_BATCH_CERTIFICATE]: resourceManager,
    [STEP_RM_EVENT_GRID_DOMAINS]: resourceManager,
    [STEP_RM_EVENT_GRID_DOMAIN_TOPICS]: resourceManager,
    [STEP_RM_EVENT_GRID_TOPICS]: resourceManager,
    [STEP_RM_EVENT_GRID_TOPIC_SUBSCRIPTIONS]: resourceManager,
    [STEP_RM_EVENT_GRID_DOMAIN_TOPIC_SUBSCRIPTIONS]: resourceManager,
  };
}
