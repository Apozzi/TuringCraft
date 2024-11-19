export type Locale = 'en' | 'pt';

export const messages: Record<Locale, {
  add_vertex: string;
  add_edge: string;
  graphics: string;
  clear: string;
  open: string;
  save: string;
  examples: string;
  graph_layout_and_organization: string;
  graph_layout: string;
  config: string;
  about: string;
  circular_layout: string;
  radial_layout: string;
  tree_layout: string;
  grid_layout: string;
  spectral_layout: string;
  fruchterman_reingold: string;
  kamada_kawai: string;
  transition_matrix: string;
  custom_sounds: string;
  configurations: string;
  periodic_example: string;
  counter_example: string;
  two_communication_classes_example: string;
  two_classes_with_small_jump_example: string;
  apply_to_graph: string;
  delete_last_vertex: string;
  vertex_visit_count: string;
  show_sound_info: string;
  save_configurations: string;
  apply_configurations: string;
  vertex_musical_note: string;
  speed: string;
  tree_layout_warning: string;
  invert_axis: string;
  apply_tree_layout: string;
  tree_layout_configurations: string;
  select_root_vertex: string;
  apply_radial_layout: string;
  no_vertices_added: string;
  vertex: string;
  musical_note: string;
  custom_sound: string;
  vertex_header: string;
  edge_header: string;
  custom_sound_header: string;
  configurations_header: string;
  developed_by: string;
  all_rights_reserved: string;
  contact: string;
  radial_layout_config: string;
  select_language: string;
  app_is_not_available_mobile: string;
  add_transition: string;
  no_transitions_added: string;
  direction: string;
  left: string;
  right: string;
  input: string;
  output: string;
  transitions: string;
  accepted: string;
  rejected: string;
  neutral: string;
  infinite_loop_example: string;
  binary_counter_example: string;
  display_msg_tip_1: string;
  display_msg_tip_2: string;
  display_digitar_number_tip: string;
  offset_screen_display: string;
  saved_successfully: string;
  same_io_error: string;
  add_edge_without_vertice: string;
  drag_vertice_valid_area: string;
  screen_display: string;
  numeric_display: string;
  end_vertex: string;
  code_generation: string;
  continue_from_stopped_simulation: string;
  empty_tape_value_msg_1: string;
  empty_tape_value_msg_2: string;
  palindrome_example: string;
}> = {
  'en': {
    add_vertex: "Add Vertex",
    add_edge: "Add Edge",
    graphics: 'Plots',
    clear: "Clear",
    open: "Open",
    save: "Save",
    examples: "Examples",
    graph_layout_and_organization: "Graph Layout",
    graph_layout: "Graph Layout",
    config: "Settings",
    about: "About",
    circular_layout: "Circular Layout",
    radial_layout: "Radial Layout",
    tree_layout: "Tree Layout",
    grid_layout: "Grid Layout",
    spectral_layout: "Spectral Layout",
    fruchterman_reingold: "Fruchterman-Reingold Algorithm",
    kamada_kawai: "Kamada-Kawai Algorithm",
    transition_matrix: "Transition Matrix",
    custom_sounds: "Custom Sounds",
    configurations: "General Settings",
    periodic_example: "Periodic",
    counter_example: "Counter",
    two_communication_classes_example: "Two Communication Classes",
    two_classes_with_small_jump_example: "Two Classes with Small Jump",
    apply_to_graph: "Apply to Graph",
    delete_last_vertex: "Delete Last Vertex",
    vertex_visit_count: "Vertex Visit Count",
    show_sound_info: "Show Sound Info (UI)",
    save_configurations: "Save Configurations",
    apply_configurations: "Apply Configurations",
    vertex_musical_note: "Vertex Musical Note",
    speed: "Speed",
    tree_layout_warning: "Note: The layout might appear chaotic if there are cycles in the graph.",
    invert_axis: "Invert Axis",
    apply_tree_layout: "Apply Tree Layout",
    tree_layout_configurations: "Tree Layout Configurations",
    select_root_vertex: "Select Root Vertex:",
    apply_radial_layout: "Apply Radial Layout",
    no_vertices_added: "No vertices added.",
    vertex: "Vertex",
    musical_note: "Musical Note",
    custom_sound: "Custom Sound",
    vertex_header: "Vertex",
    edge_header: "Edges",
    custom_sound_header: "Custom Sound Configuration",
    configurations_header: "Settings",
    developed_by: "Developed by:",
    all_rights_reserved: "All rights reserved.",
    contact: "Contact:",
    radial_layout_config: "Radial Layout Configuration",
    select_language: "Select Language: ",
    app_is_not_available_mobile: "Este aplicativo não está disponível em dispositivos móveis.",
    add_transition: "Add Transition",
    no_transitions_added: "No transitions added. To add an edge, you need to add at least one transition.",
    direction: "Direction",
    left: "Left",
    right: "Right",
    input: "Input",
    output: "Output",
    transitions: "Transitions",
    accepted: "Accepted",
    rejected: "Rejected",
    neutral: "Neutral",
    infinite_loop_example: "Ciclic Loop",
    binary_counter_example: "Binary Counter",
    display_msg_tip_1: "The screen display uses the indices from ",
    display_msg_tip_2: " of the tape to render a 20x17 screen, with each line spanning 20 indices. If the value is 0, the color is black; if 1, white. Additionally, (2 = red, 3 = green, 4 = blue, or hexadecimal starting with '#'). You can modify this in settings>general settings to use a different range of indices.",
    display_digitar_number_tip: "The numeric display uses indices 0-6 of the tape and converts the binary representation into decimal.",
    offset_screen_display: "Screen Display Offset",
    screen_display: "Screen Display",
    saved_successfully: "Saved Successfully.",
    same_io_error: "This transition already exists! (Same I/O)",
    add_edge_without_vertice: "It is not possible to add edges without any vertices.",
    drag_vertice_valid_area:  "You must drag the vertex to a valid area.",
    numeric_display: "Numeric Display",
    end_vertex: "Is it an End Vertex?",
    code_generation: "Code Generation",
    continue_from_stopped_simulation: "Continue from where simulation stopped",
    empty_tape_value_msg_1: "Use empty value on tape as default",
    empty_tape_value_msg_2: "'B' will also be considered as empty",
    palindrome_example: "Detector de Palindroma Binária"
  },
  'pt': {
    add_vertex: "Adicionar Vértice",
    add_edge: "Adicionar Aresta",
    graphics: "Gráficos",
    clear: "Limpar",
    open: "Abrir",
    save: "Salvar",
    examples: "Exemplos",
    graph_layout_and_organization: "Layout / Organização do Grafo",
    graph_layout: "Layout do Grafo",
    config: "Configurações",
    about: "Sobre",
    circular_layout: "Layout Circular",
    radial_layout: "Layout Radial",
    tree_layout: "Layout de Árvore",
    grid_layout: "Layout de Grade",
    spectral_layout: "Layout de Espectro",
    fruchterman_reingold: "Algoritmo de Fruchterman-Reingold",
    kamada_kawai: "Algoritmo de Kamada-Kawai",
    transition_matrix: "Matriz de Transição",
    custom_sounds: "Customização de Sons",
    configurations: "Configuração Geral",
    periodic_example: "Periódico",
    counter_example: "Contador",
    two_communication_classes_example: "Duas classes de Sem Comunicação",
    two_classes_with_small_jump_example: "Duas classes com Pulo",
    apply_to_graph: "Aplicar no Grafo",
    delete_last_vertex: "Deletar Último Vértice",
    vertex_visit_count: "Quant. de vezes que passou nesse vértice",
    show_sound_info: "Mostrar informações de Som (Na interface UI)",
    save_configurations: "Salvar Configurações",
    apply_configurations: "Aplicar Configurações",
    vertex_musical_note: "Nota Musical da Vertice",
    speed: "Velocidade",
    tree_layout_warning: "Obs.: O layout pode ficar caótico caso haja algum ciclo dentro do grafo.",
    invert_axis: "Inverter Eixo",
    apply_tree_layout: "Aplicar Layout de Árvore",
    tree_layout_configurations: "Configurações Layout de Árvore",
    select_root_vertex: "Selecione o Vértice Raiz:",
    apply_radial_layout: "Aplicar Layout Radial",
    no_vertices_added: "Nenhum vértice adicionado.",
    vertex: "Vértice",
    musical_note: "Nota Musical",
    custom_sound: "Som Customizado",
    vertex_header: "Vértice",
    edge_header: "Arestas",
    custom_sound_header: "Customização de Sons",
    configurations_header: "Configurações",
    developed_by: "Desenvolvido por:",
    all_rights_reserved: "Todos os direitos reservados.",
    contact: "Contato:",
    radial_layout_config: "Configurações Layout de Radial",
    select_language: "Selecionar Linguagem: ",
    app_is_not_available_mobile: "This app is not available on mobile devices.",
    add_transition: "Adicionar Transição",
    no_transitions_added: "Nenhuma transição adicionada. Para adicionar uma aresta, você precisa adicionar pelo menos uma transição.",
    direction: "Direção",
    left: "Esquerda",
    right: "Direita",
    input: "Entrada",
    output: "Saida",
    transitions: "Transições",
    accepted: "Aceitado",
    rejected: "Rejeitado",
    neutral: "Neutro",
    infinite_loop_example: "Ciclo Infinito",
    binary_counter_example: "Contador Binário",
    display_msg_tip_1: "O display tela utiliza o indices de ",
    display_msg_tip_2: " da fita a tela 20x17, cada linha de 20 em 20, caso o valor for 0 a cor é preta caso 1 branca, também (2 = vermelho, 3 = verde, 4 = azul ou hexadecimal que inicia com '#'), é possivel modificar em detalhes>configurações para utilizar um intervalo de indices diferente.",
    display_digitar_number_tip: "O display númerico utiliza o indices de 0-6 da fita e converte a representação binária em decimal.",
    offset_screen_display: "Offset do Display Tela",
    screen_display: "Display Tela",
    saved_successfully: "Salvo com sucesso.",
    same_io_error: "Essa transição já existe! (I/O iguais)",
    add_edge_without_vertice: "Não é possivel adicionar arrestas com nenhum vertice.",
    drag_vertice_valid_area:  "Você deve arrastar o vértice para uma região válida.",
    numeric_display: "Display Numérico",
    end_vertex: "É Vert. Final?",
    code_generation: "Geração de Código",
    continue_from_stopped_simulation: "Continuar da onde parou na Simulação",
    empty_tape_value_msg_1: "Usar valor vazio na fita como padrão",
    empty_tape_value_msg_2: "'B' também será considerado como vazio",
    palindrome_example: "Detector de Palindroma Binária"
  }
};