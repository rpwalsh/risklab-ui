import '@risklab/ui-react/css';
import { Button, Card, Stack, TextField } from '@risklab/ui-react';

export function QuickstartReactExample() {
  return (
    <Card>
      <Stack gap="12px">
        <TextField label="Search" placeholder="Find accounts" />
        <Button color="primary">Apply filters</Button>
      </Stack>
    </Card>
  );
}
