import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { PostsService } from '../services/posts.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CKEditorModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent {
  url: string | ArrayBuffer | null | undefined;
  public Editor = ClassicEditor;
  public config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'link',
      'insertTable',
      'mediaEmbed',
      '|',
      'bulletedList',
      'numberedList',
      'indent',
      'outdent',
    ],
    plugins: [
      Bold,
      Essentials,
      Heading,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      MediaEmbed,
      Paragraph,
      Table,
      Undo,
    ],
  };

  addForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private router: Router,
    private auth: AuthService
  ) {}

  username: string | undefined;
  ngOnInit(): void {
    this.auth.user$.pipe(map((user) => user?.name)).subscribe((username) => {
      this.username = username;
      if (username) {
        this.addForm.get('author')?.setValue(username);
      }
    });

    this.addForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: this.url,
      author: '',
      date: new Date(),
      status: 1,
    });
  }

  onFileChanged(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target!.result;
        this.addForm.get('image')?.setValue(this.url);
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.addForm.valid) {
      // console.log('Form data:', this.addForm.value);
      if (this.addForm.get('isEditorPick')?.value) {
        this.addForm.get('status')?.setValue(2);
      } else {
        this.addForm.get('status')?.setValue(1);
      }
      this.postsService.addPost(this.addForm.value).subscribe(
        (res) => {
          this.router.navigate(['/home']);
        },
        (err) => {
          console.error('Error:', err);
        }
      );
    } else {
      alert('Form is invalid');
    }
  }
}
