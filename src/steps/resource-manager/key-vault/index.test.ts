import { Recording } from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from '../../../types';
import {
  getMatchRequestsBy,
  setupAzureRecording,
} from '../../../../test/helpers/recording';
import { createMockAzureStepExecutionContext } from '../../../../test/createMockAzureStepExecutionContext';
import {
  fetchGroups,
  fetchServicePrincipals,
  fetchUsers,
} from '../../active-directory';
import {
  ACCOUNT_ENTITY_TYPE,
  GROUP_ENTITY_TYPE,
  SERVICE_PRINCIPAL_ENTITY_TYPE,
  USER_ENTITY_TYPE,
} from '../../active-directory/constants';
import {
  buildKeyVaultAccessPolicyRelationships,
  fetchKeyVaultKeys,
  fetchKeyVaults,
  fetchKeyVaultSecrets,
} from '.';
import {
  ACCOUNT_KEY_VAULT_RELATIONSHIP_TYPE,
  KeyVaultEntities,
  KeyVaultRelationships,
  KEY_VAULT_KEY_ENTITY_TYPE,
  KEY_VAULT_SERVICE_ENTITY_CLASS,
  KEY_VAULT_SERVICE_ENTITY_TYPE,
} from './constants';
import { configFromEnv } from '../../../../test/integrationInstanceConfig';
import { getMockAccountEntity } from '../../../../test/helpers/getMockEntity';
import { RESOURCE_GROUP_RESOURCE_RELATIONSHIP_CLASS } from '../utils/createResourceGroupResourceRelationship';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('rm-key-vault-vaults', () => {
  function getSetupEntities(config: IntegrationConfig) {
    const accountEntity = getMockAccountEntity(config);

    return { accountEntity };
  }

  test('success', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'rm-key-vault-vaults',
      options: {
        matchRequestsBy: getMatchRequestsBy({ config: configFromEnv }),
      },
    });

    const { accountEntity } = getSetupEntities(configFromEnv);

    const context = createMockAzureStepExecutionContext({
      instanceConfig: configFromEnv,
      setData: {
        [ACCOUNT_ENTITY_TYPE]: accountEntity,
      },
    });

    await fetchKeyVaults(context);

    expect(context.jobState.collectedEntities.length).toBeGreaterThan(0);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: KEY_VAULT_SERVICE_ENTITY_CLASS,
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === ACCOUNT_KEY_VAULT_RELATIONSHIP_TYPE,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: { const: 'azure_account_has_keyvault_service' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === RESOURCE_GROUP_RESOURCE_RELATIONSHIP_CLASS,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: { const: 'azure_resource_group_has_keyvault_service' },
        },
      },
    });
  });
});

describe('rm-key-vault-keys', () => {
  function getSetupEntities(config: IntegrationConfig) {
    const accountEntity = getMockAccountEntity(config);

    return { accountEntity };
  }

  test('success', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'rm-key-vault-keys',
      options: {
        recordFailedRequests: true,
        matchRequestsBy: getMatchRequestsBy({
          config: configFromEnv,
        }),
      },
    });

    const { accountEntity } = getSetupEntities(configFromEnv);

    const context = createMockAzureStepExecutionContext({
      instanceConfig: configFromEnv,
      setData: {
        [ACCOUNT_ENTITY_TYPE]: accountEntity,
      },
    });

    await fetchKeyVaults(context);
    await fetchKeyVaultKeys(context);

    const keyVaultEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === KEY_VAULT_SERVICE_ENTITY_TYPE,
    );
    expect(keyVaultEntities.length).toBeGreaterThan(0);

    const keyVaultKeyEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === KEY_VAULT_KEY_ENTITY_TYPE,
    );
    expect(keyVaultKeyEntities.length).toBeGreaterThan(0);

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === KeyVaultRelationships.KEY_VAULT_CONTAINS_KEY._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'CONTAINS' },
          _type: { const: 'azure_keyvault_service_contains_key' },
        },
      },
    });
  });
});

describe('rm-key-vault-secrets', () => {
  function getSetupEntities(config: IntegrationConfig) {
    const accountEntity = getMockAccountEntity(config);

    return { accountEntity };
  }

  test('success', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'rm-key-vault-secrets',
      options: {
        recordFailedRequests: true,
        matchRequestsBy: getMatchRequestsBy({
          config: configFromEnv,
        }),
      },
    });

    const { accountEntity } = getSetupEntities(configFromEnv);

    const context = createMockAzureStepExecutionContext({
      instanceConfig: configFromEnv,
      setData: {
        [ACCOUNT_ENTITY_TYPE]: accountEntity,
      },
    });

    await fetchKeyVaults(context);
    await fetchKeyVaultSecrets(context);

    const keyVaultEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === KEY_VAULT_SERVICE_ENTITY_TYPE,
    );
    expect(keyVaultEntities.length).toBeGreaterThan(0);

    const keyVaultSecretEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === KEY_VAULT_SERVICE_ENTITY_TYPE,
    );
    expect(keyVaultSecretEntities.length).toBeGreaterThan(0);

    expect(
      context.jobState.collectedRelationships.filter(
        (e) =>
          e._type === KeyVaultRelationships.KEY_VAULT_CONTAINS_SECRET._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'CONTAINS' },
          _type: { const: 'azure_keyvault_service_contains_secret' },
        },
      },
    });
  });
});

describe('rm-keyvault-principal-relationships', () => {
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  async function getSetupEntities(config: IntegrationConfig) {
    const accountEntity = getMockAccountEntity(config);

    const context = createMockAzureStepExecutionContext({
      instanceConfig: config,
      setData: {
        [ACCOUNT_ENTITY_TYPE]: accountEntity,
      },
    });

    await fetchKeyVaults(context);
    const keyVaultEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === KeyVaultEntities.KEY_VAULT._type,
    );
    expect(keyVaultEntities.length).toBeGreaterThan(0);

    await fetchUsers(context);
    const userEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === USER_ENTITY_TYPE,
    );
    expect(userEntities.length).toBeGreaterThan(0);

    await fetchGroups(context);
    const groupEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === GROUP_ENTITY_TYPE,
    );
    expect(groupEntities.length).toBeGreaterThan(0);

    await fetchServicePrincipals(context);
    const servicePrincipalEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === SERVICE_PRINCIPAL_ENTITY_TYPE,
    );
    expect(servicePrincipalEntities.length).toBeGreaterThan(0);

    return {
      keyVaultEntities,
      principals: {
        userEntities,
        groupEntities,
        servicePrincipalEntities,
      },
    };
  }

  test('sucess', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'rm-keyvault-principal-relationships',
      options: {
        matchRequestsBy: getMatchRequestsBy({ config: configFromEnv }),
      },
    });

    const { keyVaultEntities, principals } = await getSetupEntities(
      configFromEnv,
    );

    const context = createMockAzureStepExecutionContext({
      instanceConfig: configFromEnv,
      entities: keyVaultEntities,
    });

    await buildKeyVaultAccessPolicyRelationships(context);

    const keyVaultPrincipalMappedRelationships =
      context.jobState.collectedRelationships;

    expect(keyVaultPrincipalMappedRelationships).toTargetEntities([
      ...principals.userEntities,
      ...principals.groupEntities,
      ...principals.servicePrincipalEntities,
    ]);
  }, 10_000);
});
