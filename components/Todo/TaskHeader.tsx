import { ActionIcon, Group, Title } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function TaskHeader({toggleColorScheme, colorScheme} : any) {
    return (
<       Group justify='space-between' mt={20} mb={10}>
          <Title fw={900} style={{ fontFamily: 'Greycliff CF, sans-serif'}}>My Tasks</Title>
          <ActionIcon onClick={() => toggleColorScheme("")} variant='subtle' color={colorScheme === 'dark' ? 'yellow' : 'blue'}>
                {colorScheme === 'dark' ? (<IconSun/>) : (<IconMoonStars/>)}
          </ActionIcon>
        </Group>

    )
}