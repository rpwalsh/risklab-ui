import '@risklab/ui/auto';
import '@risklab/ui/css';

document.body.innerHTML = `
  <div class="ui-root" style="padding: 24px; max-width: 480px;">
    <ui-card>
      <ui-stack gap="12px">
        <ui-text-field label="Search" placeholder="Find assets"></ui-text-field>
        <ui-button variant="filled" color="primary">Run report</ui-button>
      </ui-stack>
    </ui-card>
  </div>
`;
